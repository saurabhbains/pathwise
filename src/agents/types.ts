// Agent types and interfaces

export enum AgentRole {
  EMPLOYEE = 'employee',
  HR = 'hr',
  MANAGER = 'manager', // The user/coach's client
}

export interface AgentMessage {
  role: AgentRole;
  content: string;
  timestamp: Date;
  isHidden?: boolean; // For shadow channel
}

export interface ShadowThought {
  agentRole: AgentRole;
  thought: string;
  timestamp: Date;
  flags?: string[]; // HR flags like "bias", "legal-risk", etc.
}

export interface AgentContext {
  conversationHistory: AgentMessage[];
  shadowThoughts: ShadowThought[];
  situationBrief?: string;
  employeeHandbook?: string;
  competencyMatrix?: string;
  roleDescription?: string;
}

export interface AgentResponse {
  message: string;
  shadowThought?: ShadowThought;
  metrics?: {
    psychologicalSafety?: number; // 0-100
    legalRisk?: number; // 0-100
    clarityOfFeedback?: number; // 0-100
  };
}

export interface Agent {
  role: AgentRole;
  name: string;
  processInput(userInput: string, context: AgentContext): Promise<AgentResponse>;
}
