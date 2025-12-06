// Scenario library

import { performanceReviewScenario } from './performanceReview.js';
import {
  scenarioLibrary,
  defensiveDeveloper,
  checkedOutSenior,
  highPerformerBiasComplaint
} from './scenarioLibrary.js';
import { Scenario, ScenarioType, SkillTag, ScenarioDifficulty } from '../scenarioTypes.js';

// Consolidated scenario library
export const SCENARIO_LIBRARY: Record<string, Scenario> = {
  [performanceReviewScenario.id]: performanceReviewScenario,
  [defensiveDeveloper.id]: defensiveDeveloper,
  [checkedOutSenior.id]: checkedOutSenior,
  [highPerformerBiasComplaint.id]: highPerformerBiasComplaint
};

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIO_LIBRARY[id];
}

export function getScenariosByType(type: ScenarioType): Scenario[] {
  return Object.values(SCENARIO_LIBRARY).filter(s => s.type === type);
}

export function getScenariosBySkill(skill: SkillTag): Scenario[] {
  return Object.values(SCENARIO_LIBRARY).filter(s => s.skillTags?.includes(skill));
}

export function getScenariosByDifficulty(difficulty: ScenarioDifficulty): Scenario[] {
  return Object.values(SCENARIO_LIBRARY).filter(s => s.difficulty === difficulty);
}

export function getAllScenarios(): Scenario[] {
  return Object.values(SCENARIO_LIBRARY);
}

export { performanceReviewScenario, scenarioLibrary, defensiveDeveloper, checkedOutSenior, highPerformerBiasComplaint };
