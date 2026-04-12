// Clean Vertex AI Voice Chat Implementation
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { WebSocket } from 'ws';
import { ScenarioEngine } from '../engine/engine.js';
import { logger } from '../utils/logger.js';

export class CleanVertexVoiceHandler {
  private speechClient: SpeechClient;
  private ttsClient: TextToSpeechClient;
  private recognizeStream: any = null;
  private currentTranscript: string = '';
  private audioChunks: Buffer[] = [];
  private silenceTimer: NodeJS.Timeout | null = null;
  private isListening: boolean = false;

  // VAD configuration
  private vadEnabled: boolean = true;
  private vadThreshold: number = 0.02;
  private silenceDuration: number = 1500;

  constructor(
    private ws: WebSocket,
    private engine: ScenarioEngine
  ) {
    // Initialize Vertex AI clients (uses GOOGLE_APPLICATION_CREDENTIALS)
    this.speechClient = new SpeechClient();
    this.ttsClient = new TextToSpeechClient();
    logger.info('Clean Vertex AI Voice handler initialized');
  }

  async handleMessage(data: Buffer | any) {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const text = buffer.toString('utf8');

    // Check if it's JSON control message or binary audio
    if (text.startsWith('{')) {
      const message = JSON.parse(text);
      await this.handleControlMessage(message);
    } else {
      await this.handleAudioChunk(buffer);
    }
  }

  private async handleControlMessage(message: any) {
    switch (message.type) {
      case 'voice_config':
        await this.startSpeechRecognition(message.data);
        break;

      case 'voice_start':
        this.startListening();
        break;

      case 'voice_stop':
        await this.stopListening();
        break;

      case 'vad_config':
        if (message.data) {
          this.vadEnabled = message.data.enabled ?? true;
          this.vadThreshold = message.data.threshold ?? 0.02;
          this.silenceDuration = message.data.silenceDuration ?? 1500;
          logger.info('VAD config updated', { vadEnabled: this.vadEnabled });
        }
        break;
    }
  }

  private async startSpeechRecognition(config: any) {
    const request = {
      config: {
        encoding: 'LINEAR16' as const,
        sampleRateHertz: 16000,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        model: 'latest_long',
        useEnhanced: true,
      },
      interimResults: true,
    };

    this.recognizeStream = this.speechClient
      .streamingRecognize(request)
      .on('error', (error: Error) => {
        logger.error('Speech recognition error:', error);
        this.sendError(error.message);
      })
      .on('data', (data: any) => {
        if (data.results[0] && data.results[0].alternatives[0]) {
          const transcript = data.results[0].alternatives[0].transcript;
          const isFinal = data.results[0].isFinal;

          this.currentTranscript = transcript;
          this.sendTranscript(transcript, isFinal);

          // If final and VAD not enabled, process immediately
          if (isFinal && !this.vadEnabled) {
            this.processTranscript();
          }
        }
      });

    this.isListening = true;
    this.sendStatus('ready');
    logger.info('Speech recognition stream started');
  }

  private async handleAudioChunk(audioData: Buffer) {
    if (!this.isListening) return;

    // Send to speech recognition stream
    if (this.recognizeStream) {
      this.recognizeStream.write(audioData);
    }

    // Store for VAD
    this.audioChunks.push(audioData);

    // Voice Activity Detection
    if (this.vadEnabled) {
      const energy = this.calculateEnergy(audioData);
      const isSpeech = energy > this.vadThreshold;

      if (isSpeech) {
        // Clear silence timer
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
      } else {
        // Start silence timer
        if (!this.silenceTimer && this.currentTranscript.length > 0) {
          this.silenceTimer = setTimeout(() => {
            this.processTranscript();
          }, this.silenceDuration);
        }
      }
    }
  }

  private calculateEnergy(audioData: Buffer): number {
    let sum = 0;
    for (let i = 0; i < audioData.length; i += 2) {
      const sample = audioData.readInt16LE(i) / 32768;
      sum += sample * sample;
    }
    return Math.sqrt(sum / (audioData.length / 2));
  }

  private async processTranscript() {
    if (!this.currentTranscript || this.currentTranscript.trim().length === 0) {
      return;
    }

    const transcript = this.currentTranscript.trim();
    logger.info('Processing transcript:', transcript);

    try {
      // Process through scenario engine
      const result = await this.engine.processInput(transcript);

      // Generate audio response
      const audioBuffer = await this.synthesizeSpeech(result.employeeResponse);

      // Send response
      this.ws.send(JSON.stringify({
        type: 'voice_response',
        transcript: transcript,
        employeeResponse: result.employeeResponse,
        shadowFeed: result.shadowFeed,
        metrics: result.metrics,
      }));

      // Send audio
      if (audioBuffer) {
        this.ws.send(audioBuffer);
      }

      // Reset
      this.currentTranscript = '';
      this.audioChunks = [];

      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }

    } catch (error) {
      logger.error('Error processing transcript:', error);
      this.sendError(error instanceof Error ? error.message : 'Processing error');
    }
  }

  private async synthesizeSpeech(text: string): Promise<Buffer | null> {
    try {
      const request = {
        input: { text },
        voice: {
          languageCode: 'en-US',
          name: 'en-US-Neural2-F',
          ssmlGender: 'FEMALE' as const,
        },
        audioConfig: {
          audioEncoding: 'MP3' as const,
          speakingRate: 1.0,
          pitch: 0.0,
          volumeGainDb: 0.0,
          sampleRateHertz: 24000,
        },
      };

      const [response] = await this.ttsClient.synthesizeSpeech(request);

      if (!response.audioContent) {
        logger.warn('No audio content in TTS response');
        return null;
      }

      return Buffer.from(response.audioContent);
    } catch (error) {
      logger.error('TTS error:', error);
      return null;
    }
  }

  private startListening() {
    this.isListening = true;
    this.sendStatus('listening');
    logger.info('Started listening');
  }

  private async stopListening() {
    this.isListening = false;

    // Process any remaining transcript
    if (this.currentTranscript.length > 0) {
      await this.processTranscript();
    }

    this.sendStatus('stopped');
    logger.info('Stopped listening');
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
    if (this.recognizeStream) {
      this.recognizeStream.end();
    }
    await this.speechClient.close();
    await this.ttsClient.close();
    logger.info('Clean Vertex AI Voice handler cleaned up');
  }
}
