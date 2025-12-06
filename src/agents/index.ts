// Agents module exports

export { BaseAgent } from './BaseAgent.js';
export { EmployeeAgent } from './EmployeeAgent.js';
export { HRAgent } from './HRAgent.js';
export { SimulationCoordinator } from './SimulationCoordinator.js';
export type {
  Agent,
  AgentRole,
  AgentMessage,
  AgentContext,
  AgentResponse,
  ShadowThought
} from './types.js';
export { AgentRole as AgentRoleEnum } from './types.js';
export type { SimulationState, SimulationConfig } from './SimulationCoordinator.js';
