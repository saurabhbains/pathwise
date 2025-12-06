// LLM interface + factory

import { ClaudeAdapter } from './claudeAdapter.js';
import { GeminiAdapter } from './geminiAdapter.js';
import { OllamaAdapter } from './ollamaAdapter.js';

export interface LLMProvider {
  generate(prompt: string): Promise<string>;
  generateStreaming?(prompt: string, onChunk: (chunk: string) => void): Promise<void>;
}

export type LLMProviderType = 'claude' | 'gemini' | 'ollama';

export function createLLMProvider(type: LLMProviderType): LLMProvider {
  switch (type) {
    case 'claude':
      return new ClaudeAdapter();
    case 'gemini':
      return new GeminiAdapter();
    case 'ollama':
      return new OllamaAdapter();
    default:
      throw new Error(`Unknown LLM provider type: ${type}`);
  }
}
