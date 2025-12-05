// Gemini API adapter

import type { LLMProvider } from './index.js';

export class GeminiAdapter implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    // TODO: Implement Gemini API integration
    return '';
  }
}
