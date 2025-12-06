// Gemini API adapter

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import type { LLMProvider } from './index.js';

export class GeminiAdapter implements LLMProvider {
  private genAI: GoogleGenerativeAI;
  private model: string;

  constructor() {
    if (!config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    // Using Gemini 2.0 Flash for speed and efficiency
    this.model = 'gemini-2.0-flash';
  }

  async generate(prompt: string): Promise<string> {
    try {
      logger.debug('Generating response with Gemini', { promptLength: prompt.length });

      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      logger.debug('Gemini response generated', { responseLength: text.length });
      return text;
    } catch (error) {
      logger.error('Error generating Gemini response:', error);
      throw new Error(`Gemini generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateStreaming(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    try {
      logger.debug('Generating streaming response with Gemini', { promptLength: prompt.length });

      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContentStream(prompt);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        onChunk(chunkText);
      }

      logger.debug('Gemini streaming response completed');
    } catch (error) {
      logger.error('Error generating Gemini streaming response:', error);
      throw new Error(`Gemini streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
