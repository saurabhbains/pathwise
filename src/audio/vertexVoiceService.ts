// Vertex AI Voice Service - Real-time Speech-to-Text and Text-to-Speech
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

export interface VoiceStreamConfig {
  sampleRateHertz: number;
  languageCode: string;
  encoding: 'LINEAR16' | 'MULAW' | 'ALAW';
}

export class VertexVoiceService {
  private speechClient: SpeechClient;
  private ttsClient: TextToSpeechClient;
  private recognizeStream: any = null;

  constructor() {
    // Initialize Google Cloud clients
    // Uses GOOGLE_APPLICATION_CREDENTIALS environment variable automatically
    this.speechClient = new SpeechClient();
    this.ttsClient = new TextToSpeechClient();

    logger.info('Vertex AI Voice Service initialized');
  }

  /**
   * Start streaming speech recognition
   */
  startSpeechRecognition(
    streamConfig: VoiceStreamConfig,
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onError: (error: Error) => void
  ) {
    const request = {
      config: {
        encoding: streamConfig.encoding,
        sampleRateHertz: streamConfig.sampleRateHertz,
        languageCode: streamConfig.languageCode,
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: false,
        model: 'latest_long', // Use the latest long-form model
        useEnhanced: true,
      },
      interimResults: true, // Enable interim results for real-time feedback
    };

    this.recognizeStream = this.speechClient
      .streamingRecognize(request)
      .on('error', (error: Error) => {
        logger.error('Speech recognition error:', error);
        onError(error);
      })
      .on('data', (data: any) => {
        if (data.results[0] && data.results[0].alternatives[0]) {
          const transcript = data.results[0].alternatives[0].transcript;
          const isFinal = data.results[0].isFinal;
          onTranscript(transcript, isFinal);
        }
      });

    logger.info('Speech recognition stream started');
    return this.recognizeStream;
  }

  /**
   * Write audio data to the recognition stream
   */
  writeAudioData(audioChunk: Buffer) {
    if (this.recognizeStream) {
      this.recognizeStream.write(audioChunk);
    }
  }

  /**
   * Stop streaming speech recognition
   */
  stopSpeechRecognition() {
    if (this.recognizeStream) {
      this.recognizeStream.end();
      this.recognizeStream = null;
      logger.info('Speech recognition stream stopped');
    }
  }

  /**
   * Convert text to speech and return audio buffer
   */
  async synthesizeSpeech(
    text: string,
    voiceConfig?: {
      languageCode?: string;
      name?: string;
      ssmlGender?: 'NEUTRAL' | 'MALE' | 'FEMALE';
    }
  ): Promise<Buffer> {
    const request = {
      input: { text },
      voice: {
        languageCode: voiceConfig?.languageCode || 'en-US',
        name: voiceConfig?.name || 'en-US-Neural2-C', // Natural sounding female voice
        ssmlGender: voiceConfig?.ssmlGender || 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3' as const,
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0,
        sampleRateHertz: 24000,
      },
    };

    try {
      const [response] = await this.ttsClient.synthesizeSpeech(request);

      if (!response.audioContent) {
        throw new Error('No audio content in TTS response');
      }

      return Buffer.from(response.audioContent);
    } catch (error) {
      logger.error('TTS synthesis error:', error);
      throw error;
    }
  }

  /**
   * Clean up resources
   */
  async cleanup() {
    this.stopSpeechRecognition();
    await this.speechClient.close();
    await this.ttsClient.close();
    logger.info('Vertex AI Voice Service cleaned up');
  }
}
