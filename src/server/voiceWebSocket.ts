// Voice WebSocket Handler - Real-time voice streaming
import { WebSocket } from 'ws';
import { VertexVoiceService } from '../audio/vertexVoiceService.js';
import { ScenarioEngine } from '../engine/engine.js';
import { logger } from '../utils/logger.js';

export interface VoiceMessage {
  type: 'voice_config' | 'audio_chunk' | 'voice_start' | 'voice_stop' | 'vad_config';
  data?: any;
}

export interface VoiceActivityConfig {
  enabled: boolean;
  threshold: number; // 0-1, how sensitive the VAD is
  silenceDuration: number; // ms of silence before considering speech ended
}

export class VoiceWebSocketHandler {
  private voiceService: VertexVoiceService;
  private currentTranscript: string = '';
  private vadConfig: VoiceActivityConfig = {
    enabled: true,
    threshold: 0.5,
    silenceDuration: 1500,
  };
  private silenceTimer: NodeJS.Timeout | null = null;
  private isListening: boolean = false;

  constructor(
    private ws: WebSocket,
    private engine: ScenarioEngine
  ) {
    this.voiceService = new VertexVoiceService();
  }

  // Public method to handle incoming messages (called from server.ts)
  async handleMessage(data: Buffer | ArrayBuffer | any) {
    try {
      // Convert ArrayBuffer to Buffer if needed
      const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);

      // Try to parse as JSON first (for control messages)
      const text = buffer.toString();
      if (text.startsWith('{')) {
        const message: VoiceMessage = JSON.parse(text);
        await this.handleControlMessage(message);
      } else {
        // Raw audio data
        await this.handleAudioChunk(buffer);
      }
    } catch (error) {
      logger.error('Voice WebSocket error:', error);
      this.sendError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async handleControlMessage(message: VoiceMessage) {
    switch (message.type) {
      case 'voice_config':
        await this.startVoiceRecognition(message.data);
        break;

      case 'voice_start':
        this.startListening();
        break;

      case 'voice_stop':
        await this.stopListening();
        break;

      case 'vad_config':
        this.updateVADConfig(message.data);
        break;
    }
  }

  private async startVoiceRecognition(config: any) {
    const streamConfig = {
      sampleRateHertz: config.sampleRateHertz || 16000,
      languageCode: config.languageCode || 'en-US',
      encoding: config.encoding || 'LINEAR16',
    };

    this.voiceService.startSpeechRecognition(
      streamConfig,
      (transcript, isFinal) => this.handleTranscript(transcript, isFinal),
      (error) => this.sendError(error.message)
    );

    this.isListening = true;
    this.sendStatus('voice_ready');
  }

  private async handleAudioChunk(audioData: Buffer) {
    if (!this.isListening) {
      return;
    }

    // Write audio to speech recognition stream
    this.voiceService.writeAudioData(audioData);

    // If VAD is enabled, detect silence
    if (this.vadConfig.enabled) {
      this.handleVAD(audioData);
    }
  }

  private handleVAD(audioData: Buffer) {
    // Simple VAD implementation based on audio energy
    const energy = this.calculateAudioEnergy(audioData);
    const isSpeech = energy > this.vadConfig.threshold;

    if (isSpeech) {
      // Speech detected, clear silence timer
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }
    } else {
      // Silence detected, start timer if not already running
      if (!this.silenceTimer && this.currentTranscript.length > 0) {
        this.silenceTimer = setTimeout(async () => {
          // Silence timeout reached, process the accumulated transcript
          await this.processAccumulatedTranscript();
        }, this.vadConfig.silenceDuration);
      }
    }
  }

  private calculateAudioEnergy(audioData: Buffer): number {
    // Calculate RMS energy of audio buffer
    let sum = 0;
    for (let i = 0; i < audioData.length; i += 2) {
      const sample = audioData.readInt16LE(i) / 32768; // Normalize to -1 to 1
      sum += sample * sample;
    }
    const rms = Math.sqrt(sum / (audioData.length / 2));
    return rms;
  }

  private handleTranscript(transcript: string, isFinal: boolean) {
    if (isFinal) {
      // Accumulate final transcript
      this.currentTranscript = transcript;
      this.sendTranscript(transcript, true);

      // If VAD is not enabled, process immediately
      if (!this.vadConfig.enabled) {
        this.processAccumulatedTranscript();
      }
    } else {
      // Send interim results for real-time feedback
      this.sendTranscript(transcript, false);
    }
  }

  private async processAccumulatedTranscript() {
    if (this.currentTranscript.trim().length === 0) {
      return;
    }

    logger.info('Processing transcript:', this.currentTranscript);

    try {
      // Process through scenario engine
      const result = await this.engine.processInput(this.currentTranscript);

      // Generate TTS response
      const audioBuffer = await this.voiceService.synthesizeSpeech(result.employeeResponse);

      // Send response back
      this.ws.send(JSON.stringify({
        type: 'voice_response',
        transcript: this.currentTranscript,
        employeeResponse: result.employeeResponse,
        shadowFeed: result.shadowFeed,
        metrics: result.metrics,
      }));

      // Send audio
      this.ws.send(audioBuffer);

      // Reset transcript
      this.currentTranscript = '';
    } catch (error) {
      logger.error('Error processing transcript:', error);
      this.sendError(error instanceof Error ? error.message : 'Processing error');
    }
  }

  private startListening() {
    this.isListening = true;
    this.sendStatus('listening');
  }

  private async stopListening() {
    this.isListening = false;

    // Process any remaining transcript
    if (this.currentTranscript.length > 0) {
      await this.processAccumulatedTranscript();
    }

    this.voiceService.stopSpeechRecognition();
    this.sendStatus('stopped');
  }

  private updateVADConfig(config: Partial<VoiceActivityConfig>) {
    this.vadConfig = { ...this.vadConfig, ...config };
    logger.info('VAD config updated:', this.vadConfig);
  }

  private sendTranscript(transcript: string, isFinal: boolean) {
    this.ws.send(JSON.stringify({
      type: 'transcript',
      transcript,
      isFinal,
    }));
  }

  private sendStatus(status: string) {
    this.ws.send(JSON.stringify({
      type: 'voice_status',
      status,
    }));
  }

  private sendError(message: string) {
    this.ws.send(JSON.stringify({
      type: 'voice_error',
      message,
    }));
  }

  async cleanup() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }
    this.voiceService.stopSpeechRecognition();
    await this.voiceService.cleanup();
  }
}
