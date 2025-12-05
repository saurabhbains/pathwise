// Claude API adapter

import type { LLMProvider } from './index.js';

export class ClaudeAdapter implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    // TODO: Implement Claude API integration
    return '';
  }
}
