// Types/interfaces for scenario JSON/YAML

export interface Scenario {
  id: string;
  name: string;
  description?: string;
}

export interface ScenarioState {
  currentScenario?: Scenario;
  // Placeholder for future scenario state
}
