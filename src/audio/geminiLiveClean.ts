// Gemini Live - Real-time Speech-to-Speech via Vertex AI REST API
import { WebSocket } from 'ws';
import { config } from '../utils/config.js';
import { ScenarioEngine } from '../engine/engine.js';
import { logger } from '../utils/logger.js';

export class GeminiLiveHandler {
  private apiKey: string;
  private apiEndpoint: string;
  private audioChunks: Buffer[] = [];
  private silenceTimer: NodeJS.Timeout | null = null;
  private isListening: boolean = false;

  // VAD config
  private vadEnabled: boolean = true;
  private vadThreshold: number = 0.02;
  private silenceDuration: number = 1500;

  constructor(
    private ws: WebSocket,
    private engine: ScenarioEngine
  ) {
    this.apiKey = config.vertexAI.apiKey;
    this.apiEndpoint = 'https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent';

    if (!this.apiKey) {
      throw new Error('VERTEX_AI_API_KEY not configured');
    }

    logger.info('Gemini Live handler initialized (REST API)', {
      model: 'gemini-2.5-flash-lite',
    });
  }

  async handleMessage(data: Buffer | any) {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const text = buffer.toString('utf8');

    if (text.startsWith('{')) {
      const message = JSON.parse(text);
      await this.handleControl(message);
    } else {
      await this.handleAudio(buffer);
    }
  }

  private async handleControl(message: any) {
    switch (message.type) {
      case 'voice_config':
        this.isListening = true;
        this.sendStatus('ready');
        logger.info('Voice configured');
        break;

      case 'voice_start':
        this.isListening = true;
        this.audioChunks = [];
        this.sendStatus('listening');
        logger.info('Started listening');
        break;

      case 'voice_stop':
        this.isListening = false;
        await this.processAudio();
        this.sendStatus('stopped');
        logger.info('Stopped listening');
        break;

      case 'vad_config':
        if (message.data) {
          this.vadEnabled = message.data.enabled ?? true;
          this.vadThreshold = message.data.threshold ?? 0.02;
          this.silenceDuration = message.data.silenceDuration ?? 1500;
        }
        break;
    }
  }

  private async handleAudio(audioData: Buffer) {
    if (!this.isListening) return;

    this.audioChunks.push(audioData);

    // Voice Activity Detection
    if (this.vadEnabled) {
      const energy = this.calculateEnergy(audioData);
      const isSpeech = energy > this.vadThreshold;

      if (isSpeech) {
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
      } else {
        if (!this.silenceTimer && this.audioChunks.length > 0) {
          this.silenceTimer = setTimeout(() => {
            this.processAudio();
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

  private async processAudio() {
    if (this.audioChunks.length === 0) return;

    try {
      const pcmData = Buffer.concat(this.audioChunks);
      const wavData = this.pcmToWav(pcmData);
      const base64Audio = wavData.toString('base64');

      logger.info('Processing audio', {
        chunks: this.audioChunks.length,
        size: pcmData.length
      });

      // Call Vertex AI REST API
      const apiUrl = `${this.apiEndpoint}?key=${this.apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'audio/wav',
                  data: base64Audio,
                },
              },
              {
                text: 'Transcribe the audio. Return ONLY the transcription, nothing else.',
              },
            ],
          }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      // Handle streaming response (array of chunks)
      const chunks = Array.isArray(result) ? result : [result];

      // Combine all text from all chunks
      let transcript = '';
      for (const chunk of chunks) {
        if (chunk.candidates && chunk.candidates.length > 0) {
          const parts = chunk.candidates[0].content.parts;
          const text = parts.map((p: any) => p.text || '').join('');
          transcript += text;
        }
      }

      transcript = transcript.trim();

      if (!transcript) {
        logger.warn('Empty transcription');
        this.audioChunks = [];
        return;
      }

      logger.info('Transcribed:', transcript);
      this.sendTranscript(transcript, true);

      // Process through scenario engine
      const engineResult = await this.engine.processInput(transcript);

      // Send response (text only for now - TTS can be added later)
      this.ws.send(JSON.stringify({
        type: 'voice_response',
        transcript: transcript,
        employeeResponse: engineResult.employeeResponse,
        shadowFeed: engineResult.shadowFeed,
        metrics: engineResult.metrics,
      }));

      logger.info('Response sent');

      // Clear audio chunks
      this.audioChunks = [];
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }

    } catch (error) {
      logger.error('Error processing audio:', error);
      this.sendError(error instanceof Error ? error.message : 'Processing error');
      this.audioChunks = [];
    }
  }

  private pcmToWav(pcmData: Buffer, sampleRate: number = 16000): Buffer {
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = pcmData.length;

    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(dataSize + 36, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(bitsPerSample, 34);
    header.write('data', 36);
    header.writeUInt32LE(dataSize, 40);

    return Buffer.concat([header, pcmData]);
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
    this.audioChunks = [];
    logger.info('Gemini Live handler cleaned up');
  }
}
