// Base agent class

import type { LLMProvider } from '../llm/index.js';
import type { Agent, AgentRole, AgentContext, AgentResponse } from './types.js';
import { logger } from '../utils/logger.js';

export abstract class BaseAgent implements Agent {
  public readonly role: AgentRole;
  public readonly name: string;
  protected llm: LLMProvider;

  constructor(role: AgentRole, name: string, llm: LLMProvider) {
    this.role = role;
    this.name = name;
    this.llm = llm;
  }

  abstract buildPrompt(userInput: string, context: AgentContext): string;
  abstract parseResponse(llmResponse: string): AgentResponse;

  async processInput(userInput: string, context: AgentContext): Promise<AgentResponse> {
    try {
      logger.debug(`${this.name} processing input`, { inputLength: userInput.length });

      // Build the prompt based on agent type
      const prompt = this.buildPrompt(userInput, context);

      // Get response from LLM
      const llmResponse = await this.llm.generate(prompt);

      // Parse and structure the response
      const response = this.parseResponse(llmResponse);

      logger.debug(`${this.name} generated response`, {
        responseLength: response.message.length,
        hasShadowThought: !!response.shadowThought
      });

      return response;
    } catch (error) {
      logger.error(`${this.name} processing error:`, error);
      throw error;
    }
  }

  protected formatConversationHistory(context: AgentContext): string {
    return context.conversationHistory
      .filter(msg => !msg.isHidden) // Only include visible messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n');
  }
}
