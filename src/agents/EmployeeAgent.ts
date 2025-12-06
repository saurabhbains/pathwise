// Employee Agent - Defensive, blame-deflecting, emotionally manipulative

import { BaseAgent } from './BaseAgent.js';
import { AgentRole, type AgentContext, type AgentResponse, type ShadowThought } from './types.js';
import type { LLMProvider } from '../llm/index.js';

export class EmployeeAgent extends BaseAgent {
  constructor(llm: LLMProvider, employeeName: string = 'Alex') {
    super(AgentRole.EMPLOYEE, employeeName, llm);
  }

  buildPrompt(userInput: string, context: AgentContext): string {
    const conversationHistory = this.formatConversationHistory(context);
    const situationBrief = context.situationBrief || 'General performance discussion';

    return `You are roleplaying as an employee named ${this.name} in a performance review conversation.

SITUATION CONTEXT:
${situationBrief}

YOUR CHARACTER TRAITS:
- Defensive and resistant to negative feedback
- Blame-deflecting (blame others, circumstances, or the system)
- Emotionally manipulative when feeling threatened
- May become passive-aggressive or dismissive
- Sensitive to perceived unfairness or bias
- Will note internally when manager uses vague or potentially biased language

CONVERSATION HISTORY:
${conversationHistory}

MANAGER'S LATEST STATEMENT:
${userInput}

INSTRUCTIONS:
You must respond in the following JSON format:
{
  "response": "Your spoken/visible response to the manager",
  "hidden_thought": "Your internal reaction - what you're really thinking but not saying out loud. Note any red flags like vague language, potential bias, or unfair treatment."
}

Stay in character. Be realistic about how a defensive employee would react. Don't make it too obvious - subtlety is key.

Respond ONLY with valid JSON:`;
  }

  parseResponse(llmResponse: string): AgentResponse {
    try {
      // Extract JSON from response (in case LLM adds extra text)
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      const shadowThought: ShadowThought = {
        agentRole: this.role,
        thought: parsed.hidden_thought || '',
        timestamp: new Date(),
        flags: this.extractFlags(parsed.hidden_thought || '')
      };

      return {
        message: parsed.response || '',
        shadowThought
      };
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        message: llmResponse,
        shadowThought: {
          agentRole: this.role,
          thought: 'Unable to process internal thoughts',
          timestamp: new Date()
        }
      };
    }
  }

  private extractFlags(thought: string): string[] {
    const flags: string[] = [];
    const lowerThought = thought.toLowerCase();

    // Check for various concern indicators
    if (lowerThought.includes('bias') || lowerThought.includes('unfair')) {
      flags.push('potential-bias');
    }
    if (lowerThought.includes('vague') || lowerThought.includes('unclear')) {
      flags.push('vague-feedback');
    }
    if (lowerThought.includes('personal') || lowerThought.includes('attack')) {
      flags.push('feels-attacked');
    }
    if (lowerThought.includes('not fit') || lowerThought.includes('culture fit')) {
      flags.push('culture-fit-concern');
    }

    return flags;
  }
}
