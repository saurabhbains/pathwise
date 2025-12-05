// Ollama adapter

import type { LLMProvider } from './index.js';

export class OllamaAdapter implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    // TODO: Implement Ollama integration
    return '';
  }
}
