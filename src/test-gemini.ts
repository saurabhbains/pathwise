// Test script for Gemini adapter
// Run with: npm run dev -- src/test-gemini.ts

import { GeminiAdapter } from './llm/geminiAdapter.js';
import { logger } from './utils/logger.js';

async function testGemini() {
  try {
    logger.info('Testing Gemini adapter...');

    const gemini = new GeminiAdapter();

    // Test basic generation
    logger.info('Test 1: Basic generation');
    const response = await gemini.generate('Say hello in a professional manner.');
    logger.info('Response:', response);

    // Test streaming generation
    logger.info('\nTest 2: Streaming generation');
    let streamedResponse = '';
    await gemini.generateStreaming(
      'Count from 1 to 5 slowly, one number per line.',
      (chunk) => {
        streamedResponse += chunk;
        process.stdout.write(chunk);
      }
    );
    logger.info('\nStreamed response complete:', { length: streamedResponse.length });

    logger.info('\n✅ All tests passed!');
  } catch (error) {
    logger.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testGemini();
