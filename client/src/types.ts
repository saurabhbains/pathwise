// Frontend type definitions

export interface Message {
  id: string;
  role: 'manager' | 'employee';
  content: string;
  timestamp: Date;
}

export interface ShadowThought {
  agentRole: 'employee' | 'hr';
  thought: string;
  timestamp: Date;
  flags?: string[];
}

export interface Metrics {
  psychologicalSafety: number;
  legalRisk: number;
  clarityOfFeedback: number;
}

export interface SimulationState {
  isActive: boolean;
  turnCount: number;
  messages: Message[];
  shadowThoughts: ShadowThought[];
  metrics: Metrics;
}

export interface ScenarioInfo {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  employeeName: string;
}
