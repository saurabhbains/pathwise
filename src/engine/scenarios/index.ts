// Scenario library

import { performanceReviewScenario } from './performanceReview.js';
import { Scenario, ScenarioType } from '../scenarioTypes.js';

export const SCENARIO_LIBRARY: Record<string, Scenario> = {
  [performanceReviewScenario.id]: performanceReviewScenario
};

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIO_LIBRARY[id];
}

export function getScenariosByType(type: ScenarioType): Scenario[] {
  return Object.values(SCENARIO_LIBRARY).filter(s => s.type === type);
}

export function getAllScenarios(): Scenario[] {
  return Object.values(SCENARIO_LIBRARY);
}

export { performanceReviewScenario };
