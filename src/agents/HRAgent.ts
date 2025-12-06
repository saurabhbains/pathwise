// HR Agent - Silent observer monitoring for legal risks and bias

import { BaseAgent } from './BaseAgent.js';
import { AgentRole, type AgentContext, type AgentResponse, type ShadowThought } from './types.js';
import type { LLMProvider } from '../llm/index.js';

export class HRAgent extends BaseAgent {
  constructor(llm: LLMProvider) {
    super(AgentRole.HR, 'HR Observer', llm);
  }

  buildPrompt(userInput: string, context: AgentContext): string {
    const conversationHistory = this.formatConversationHistory(context);
    const handbook = context.employeeHandbook || this.getDefaultHandbookGuidelines();

    return `You are an HR Business Partner silently observing a performance review conversation.
Your role is to identify legal risks, bias, and policy violations WITHOUT participating in the conversation.

EMPLOYEE HANDBOOK & POLICIES:
${handbook}

CONVERSATION HISTORY:
${conversationHistory}

MANAGER'S LATEST STATEMENT:
"${userInput}"

YOUR TASK:
Analyze the manager's statement for:
1. Legal risks (discrimination, harassment, retaliation)
2. Bias indicators (subjective language, vague criticism, personal attacks)
3. Policy violations (missing documentation, improper termination language)
4. Clarity issues (lack of specific examples, actionable feedback)

Respond in JSON format:
{
  "analysis": "Your professional assessment of what just happened",
  "flags": ["array", "of", "specific", "issues"],
  "legal_risk_score": 0-100,
  "recommendations": "Brief guidance for the manager (if needed)"
}

Be objective and professional. Focus on actionable concerns.

Respond ONLY with valid JSON:`;
  }

  parseResponse(llmResponse: string): AgentResponse {
    try {
      // Extract JSON from response
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      const shadowThought: ShadowThought = {
        agentRole: this.role,
        thought: parsed.analysis || '',
        timestamp: new Date(),
        flags: parsed.flags || []
      };

      const legalRiskScore = this.normalizScore(parsed.legal_risk_score);
      const psychSafetyScore = 100 - legalRiskScore; // Inverse relationship
      const clarityScore = this.assessClarity(parsed.flags || []);

      return {
        message: '', // HR agent doesn't speak in the conversation
        shadowThought,
        metrics: {
          legalRisk: legalRiskScore,
          psychologicalSafety: psychSafetyScore,
          clarityOfFeedback: clarityScore
        }
      };
    } catch (error) {
      // Fallback
      return {
        message: '',
        shadowThought: {
          agentRole: this.role,
          thought: 'Monitoring conversation',
          timestamp: new Date(),
          flags: []
        },
        metrics: {
          legalRisk: 0,
          psychologicalSafety: 50,
          clarityOfFeedback: 50
        }
      };
    }
  }

  private normalizScore(score: number | undefined): number {
    if (score === undefined || score === null) return 0;
    return Math.max(0, Math.min(100, score));
  }

  private assessClarity(flags: string[]): number {
    // Lower clarity score if there are vague feedback flags
    const clarityIssues = flags.filter(f =>
      f.toLowerCase().includes('vague') ||
      f.toLowerCase().includes('unclear') ||
      f.toLowerCase().includes('subjective')
    ).length;

    return Math.max(0, 100 - (clarityIssues * 25));
  }

  private getDefaultHandbookGuidelines(): string {
    return `COMPANY PERFORMANCE MANAGEMENT POLICY:

1. PROHIBITED LANGUAGE:
   - Subjective/vague terms: "not fitting in", "cultural issues", "attitude problem"
   - Personal attacks or character judgments
   - Protected class references (age, race, gender, etc.)

2. REQUIRED PRACTICES:
   - Provide specific, documented examples
   - Focus on behaviors and outcomes, not personality
   - Offer clear, actionable improvement steps
   - Document all performance discussions

3. LEGAL RISK AREAS:
   - Discrimination (protected classes)
   - Retaliation (previous complaints)
   - Harassment (hostile environment)
   - Wrongful termination setup

4. BEST PRACTICES:
   - Use "I noticed..." not "You are..."
   - Cite specific dates, examples, metrics
   - Ask questions, don't make assumptions
   - Focus on future improvement, not past blame`;
  }
}
