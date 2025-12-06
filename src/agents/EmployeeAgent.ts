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
    
    // Extract rich character bio if available
    const characterContext = this.buildCharacterContext(context);

    return `You are roleplaying as an employee named ${this.name} in a performance review conversation.

${characterContext}

SITUATION CONTEXT:
${situationBrief}

CONVERSATION HISTORY:
${conversationHistory}

MANAGER'S LATEST STATEMENT:
"${userInput}"

INSTRUCTIONS:
You must respond in the following JSON format:
{
  "response": "Your spoken/visible response to the manager",
  "hidden_thought": "Your internal reaction - what you're really thinking but not saying out loud. Reference your backstory and motivations. Note any red flags like vague language, potential bias, or unfair treatment."
}

CRITICAL: Stay consistent with your character profile. Reference past feedback, stressors, and your communication style. If this is a recurring issue, mention "This is the third time we talk about this..." or similar. Show your trigger points when activated.

Respond ONLY with valid JSON:`;
  }

  private buildCharacterContext(context: AgentContext): string {
    // Extract character bio from context if available
    const characterBio = (context as any).characterBio;
    
    if (characterBio) {
      // Use rich character bio from scenario
      let contextStr = `YOUR CHARACTER PROFILE:
Name: ${characterBio.name}
Role: ${characterBio.role}
Tenure: ${characterBio.tenure}
Persona Type: ${characterBio.personaType}

YOUR MOTIVATIONS:
${characterBio.motivations?.map((m: string) => `- ${m}`).join('\n') || '- Not specified'}

YOUR CURRENT STRESSORS:
${characterBio.stressors?.map((s: string) => `- ${s}`).join('\n') || '- None specified'}

YOUR COMMUNICATION STYLE: ${characterBio.communicationStyle}

YOUR TRIGGER POINTS (what makes you defensive/upset):
${characterBio.triggerPoints?.map((t: string) => `- ${t}`).join('\n') || '- Not specified'}

PRIOR FEEDBACK YOU'VE RECEIVED:
${characterBio.priorFeedback?.map((f: string) => `- ${f}`).join('\n') || '- None'}`;

      if (characterBio.identityDimensions) {
        contextStr += `\n\nYOUR BACKGROUND: ${characterBio.identityDimensions}`;
      }
      
      if (characterBio.personalCircumstances) {
        contextStr += `\n\nCURRENT CIRCUMSTANCES: ${characterBio.personalCircumstances}`;
      }

      return contextStr;
    }
    
    // Fallback to default defensive traits if no character bio
    return `YOUR CHARACTER TRAITS:
- Defensive and resistant to negative feedback
- Blame-deflecting (blame others, circumstances, or the system)
- Emotionally manipulative when feeling threatened
- May become passive-aggressive or dismissive
- Sensitive to perceived unfairness or bias
- Will note internally when manager uses vague or potentially biased language

YOUR COMMUNICATION STYLE: Initially polite but quickly becomes defensive when criticized.

YOUR TRIGGERS:
- Vague criticism without specific examples
- Being compared to others
- Feeling like your efforts aren't recognized
- Perception of personal attacks vs. behavior feedback`;
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
