// Glue between stt → core engine → tts

import { WhisperSTT } from './stt/whisper.js';
import { PiperTTS } from './tts/piper.js';

export class AudioPipeline {
  private stt: WhisperSTT;
  private tts: PiperTTS;

  constructor() {
    this.stt = new WhisperSTT();
    this.tts = new PiperTTS();
  }

  async processAudio(audioBuffer: Buffer): Promise<Buffer> {
    // TODO: Implement audio pipeline: stt → engine → tts
    return Buffer.from('');
  }
}
