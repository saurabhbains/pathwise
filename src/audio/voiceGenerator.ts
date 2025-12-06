// Google Cloud Text-to-Speech voice generator

import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { logger } from '../utils/logger.js';

// Voice configurations for different agents
export enum VoiceProfile {
  EMPLOYEE = 'employee',
  HR = 'hr',
  NARRATOR = 'narrator'
}

interface VoiceConfig {
  languageCode: string;
  name: string;
  ssmlGender: 'MALE' | 'FEMALE' | 'NEUTRAL';
  description: string;
}

// Neural2 voices - Google's most human-like quality
const VOICE_CONFIGS: Record<VoiceProfile, VoiceConfig> = {
  [VoiceProfile.EMPLOYEE]: {
    languageCode: 'en-US',
    name: 'en-US-Neural2-F', // Female voice - younger, defensive
    ssmlGender: 'FEMALE',
    description: 'Employee Alex - Defensive, emotional'
  },
  [VoiceProfile.HR]: {
    languageCode: 'en-US',
    name: 'en-US-Neural2-D', // Male voice - stern, authoritative
    ssmlGender: 'MALE',
    description: 'HR Observer - Professional, analytical'
  },
  [VoiceProfile.NARRATOR]: {
    languageCode: 'en-US',
    name: 'en-US-Neural2-C', // Neutral voice - for system messages
    ssmlGender: 'FEMALE',
    description: 'System narrator'
  }
};

export class VoiceGenerator {
  private client: TextToSpeechClient;
  private enabled: boolean;

  constructor() {
    try {
      // Initialize client - will use GOOGLE_APPLICATION_CREDENTIALS env var
      this.client = new TextToSpeechClient();
      this.enabled = true;
      logger.info('Google Cloud TTS initialized');
    } catch (error) {
      logger.warn('Google Cloud TTS not available - audio disabled', { error });
      this.enabled = false;
      // Create a dummy client to avoid null checks
      this.client = null as any;
    }
  }

  /**
   * Generate speech audio from text
   * @param text - The text to convert to speech
   * @param profile - Which voice profile to use
   * @returns Base64-encoded audio data (MP3 format)
   */
  async generateSpeech(text: string, profile: VoiceProfile): Promise<string | null> {
    if (!this.enabled) {
      logger.debug('TTS disabled, skipping audio generation');
      return null;
    }

    try {
      const voiceConfig = VOICE_CONFIGS[profile];

      logger.debug('Generating speech', {
        profile,
        voiceName: voiceConfig.name,
        textLength: text.length
      });

      const request = {
        input: { text },
        voice: {
          languageCode: voiceConfig.languageCode,
          name: voiceConfig.name,
          ssmlGender: voiceConfig.ssmlGender as any
        },
        audioConfig: {
          audioEncoding: 'MP3' as const,
          speakingRate: 1.0, // Normal speed
          pitch: 0.0, // Normal pitch
          volumeGainDb: 0.0 // Normal volume
        }
      };

      const [response] = await this.client.synthesizeSpeech(request);

      if (!response.audioContent) {
        throw new Error('No audio content in response');
      }

      // Convert to base64 for easy transmission over WebSocket
      const audioBase64 = Buffer.from(response.audioContent).toString('base64');

      logger.debug('Speech generated successfully', {
        profile,
        audioSizeBytes: response.audioContent.length
      });

      return audioBase64;
    } catch (error) {
      logger.error('Error generating speech:', error);
      return null;
    }
  }

  /**
   * Check if TTS is available
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get voice configuration details
   */
  getVoiceConfig(profile: VoiceProfile): VoiceConfig {
    return VOICE_CONFIGS[profile];
  }
}

// Singleton instance
let voiceGeneratorInstance: VoiceGenerator | null = null;

export function getVoiceGenerator(): VoiceGenerator {
  if (!voiceGeneratorInstance) {
    voiceGeneratorInstance = new VoiceGenerator();
  }
  return voiceGeneratorInstance;
}
