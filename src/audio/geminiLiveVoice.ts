// Vertex AI - Real-time Voice-to-Voice (uses Google Cloud credits)
import { VertexAI } from '@google-cloud/vertexai';
import { WebSocket } from 'ws';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { ScenarioEngine } from '../engine/engine.js';

export interface VoiceConfig {
  sampleRate: number;
  encoding: string;
}

export class GeminiLiveVoiceHandler {
  private vertexAI: VertexAI;
  private currentTranscript: string = '';
  private isListening: boolean = false;
  private audioChunks: Buffer[] = [];
  private silenceTimer: NodeJS.Timeout | null = null;
  private vadThreshold: number = 0.02;
  private silenceDuration: number = 1500;
  private vadEnabled: boolean = true;

  constructor(
    private ws: WebSocket,
    private engine: ScenarioEngine
  ) {
    // Initialize Vertex AI with project and location
    // Uses GOOGLE_APPLICATION_CREDENTIALS environment variable for auth
    this.vertexAI = new VertexAI({
      project: config.vertexAI.projectId,
      location: config.vertexAI.location,
    });
    logger.info('Vertex AI Voice handler initialized', {
      project: config.vertexAI.projectId,
      location: config.vertexAI.location
    });
  }

  async handleMessage(data: Buffer | ArrayBuffer | any) {
    try {
      const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);

      // Check if it's a JSON control message
      const text = buffer.toString();
      if (text.startsWith('{')) {
        const message = JSON.parse(text);
        await this.handleControlMessage(message);
      } else {
        // Raw audio data
        await this.handleAudioChunk(buffer);
      }
    } catch (error) {
      logger.error('Gemini Live Voice error:', error);
      this.sendError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async handleControlMessage(message: any) {
    switch (message.type) {
      case 'voice_config':
        this.isListening = true;
        this.sendStatus('voice_ready');
        logger.info('Voice config received, ready to listen');
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
          logger.info('VAD config updated:', { vadEnabled: this.vadEnabled, threshold: this.vadThreshold });
        }
        break;
    }
  }

  private async handleAudioChunk(audioData: Buffer) {
    if (!this.isListening) {
      return;
    }

    // Accumulate audio chunks
    this.audioChunks.push(audioData);

    // Send interim transcript feedback
    this.sendTranscript('Listening...', false);

    // If VAD is enabled, detect silence
    if (this.vadEnabled) {
      this.handleVAD(audioData);
    }
  }

  private handleVAD(audioData: Buffer) {
    const energy = this.calculateAudioEnergy(audioData);
    const isSpeech = energy > this.vadThreshold;

    if (isSpeech) {
      // Speech detected, clear silence timer
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }
    } else {
      // Silence detected, start timer if not already running
      if (!this.silenceTimer && this.audioChunks.length > 0) {
        this.silenceTimer = setTimeout(async () => {
          await this.processAudioChunks();
        }, this.silenceDuration);
      }
    }
  }

  private calculateAudioEnergy(audioData: Buffer): number {
    let sum = 0;
    for (let i = 0; i < audioData.length; i += 2) {
      const sample = audioData.readInt16LE(i) / 32768;
      sum += sample * sample;
    }
    return Math.sqrt(sum / (audioData.length / 2));
  }

  private pcmToWav(pcmData: Buffer, sampleRate: number = 16000): Buffer {
    // Create WAV header for PCM audio
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = pcmData.length;
    const headerSize = 44;

    const header = Buffer.alloc(headerSize);

    // RIFF chunk descriptor
    header.write('RIFF', 0);
    header.writeUInt32LE(dataSize + headerSize - 8, 4);
    header.write('WAVE', 8);

    // fmt sub-chunk
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
    header.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(bitsPerSample, 34);

    // data sub-chunk
    header.write('data', 36);
    header.writeUInt32LE(dataSize, 40);

    return Buffer.concat([header, pcmData]);
  }

  private async processAudioChunks() {
    if (this.audioChunks.length === 0) {
      return;
    }

    try {
      // Combine all audio chunks
      const combinedPcm = Buffer.concat(this.audioChunks);

      // Convert PCM to WAV format (adds WAV header)
      const wavAudio = this.pcmToWav(combinedPcm);

      // Convert WAV to base64 for Gemini
      const audioBase64 = wavAudio.toString('base64');

      logger.info('Processing audio with Gemini Live', { pcmSize: combinedPcm.length, wavSize: wavAudio.length });

      // Use Vertex AI Gemini to transcribe audio
      const model = this.vertexAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite'  // Using Vertex AI - will use your $300 credit
      });

      // Create a properly formatted request for Vertex AI
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'audio/wav',  // WAV format (PCM with header)
                  data: audioBase64
                }
              },
              {
                text: 'Transcribe this audio exactly as spoken. Only return the transcription, nothing else.'
              }
            ]
          }
        ]
      });

      // Extract text from Vertex AI response
      const candidates = result.response.candidates;
      if (!candidates || candidates.length === 0) {
        logger.warn('No transcription candidates returned');
        this.audioChunks = [];
        return;
      }

      const content = candidates[0].content;
      const parts = content.parts;
      const transcript = parts.map((part: any) => part.text).join('').trim();

      this.currentTranscript = transcript;

      if (transcript && transcript.length > 0) {
        logger.info('Transcribed:', transcript);
        this.sendTranscript(transcript, true);

        // Process through scenario engine
        const engineResult = await this.engine.processInput(transcript);

        // Generate audio response using Gemini
        const audioResponse = await this.generateSpeech(engineResult.employeeResponse);

        // Send response back
        this.ws.send(JSON.stringify({
          type: 'voice_response',
          transcript: transcript,
          employeeResponse: engineResult.employeeResponse,
          shadowFeed: engineResult.shadowFeed,
          metrics: engineResult.metrics,
        }));

        // Send audio if generated
        if (audioResponse) {
          this.ws.send(audioResponse);
        }
      }

      // Clear audio chunks
      this.audioChunks = [];
      this.currentTranscript = '';

    } catch (error) {
      logger.error('Error processing audio:', error);
      this.sendError(error instanceof Error ? error.message : 'Processing error');
      this.audioChunks = [];
    }
  }

  private async generateSpeech(text: string): Promise<Buffer | null> {
    try {
      // For now, use a simple TTS approach
      // In the future, we can use Gemini's audio output when available
      logger.info('Generating speech (text-only response for now)');
      return null;
    } catch (error) {
      logger.error('Error generating speech:', error);
      return null;
    }
  }

  private startListening() {
    this.isListening = true;
    this.audioChunks = [];
    this.sendStatus('listening');
    logger.info('Started listening');
  }

  private async stopListening() {
    this.isListening = false;

    // Process any remaining audio
    if (this.audioChunks.length > 0) {
      await this.processAudioChunks();
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
    this.audioChunks = [];
    logger.info('Gemini Live Voice handler cleaned up');
  }
}
