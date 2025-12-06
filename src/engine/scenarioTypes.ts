// Types/interfaces for scenario definitions

export enum ScenarioType {
  PERFORMANCE_REVIEW = 'performance_review',
  LAYOFF = 'layoff',
  PROMOTION_DENIAL = 'promotion_denial',
  CONFLICT_RESOLUTION = 'conflict_resolution',
  FEEDBACK_DELIVERY = 'feedback_delivery'
}

export enum ScenarioDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface ScenarioContext {
  // A. Role Description
  roleDescription?: string;

  // B. Situation Brief (user-generated)
  situationBrief: string;

  // C. Company Context
  employeeHandbook?: string;
  toneGuide?: string;

  // D. Coaching Context
  competencyMatrix?: string;

  // Additional context
  employeeName?: string;
  employeeRole?: string;
  managerName?: string;
}

export interface Scenario {
  id: string;
  type: ScenarioType;
  name: string;
  description: string;
  difficulty: ScenarioDifficulty;

  // Default context/prompts for this scenario type
  defaultContext: Partial<ScenarioContext>;

  // Learning objectives
  objectives: string[];

  // Success criteria
  successCriteria: {
    minTurns?: number;
    maxLegalRisk?: number;
    minPsychologicalSafety?: number;
    minClarityScore?: number;
  };
}

export interface ScenarioState {
  scenario: Scenario;
  context: ScenarioContext;
  isActive: boolean;
  startedAt?: Date;
  endedAt?: Date;
  turnCount: number;

  // Outcome tracking
  finalMetrics?: {
    psychologicalSafety: number;
    legalRisk: number;
    clarityOfFeedback: number;
  };

  outcome?: ScenarioOutcome;
}

export enum ScenarioOutcome {
  SUCCESS = 'success',
  FAILURE = 'failure',
  ABANDONED = 'abandoned',
  IN_PROGRESS = 'in_progress'
}

export interface ScenarioReport {
  scenarioId: string;
  scenarioName: string;
  duration: number; // milliseconds
  turnCount: number;
  outcome: ScenarioOutcome;

  // The "Cringe List" - top problematic statements
  topIssues: {
    timestamp: Date;
    managerStatement: string;
    issue: string;
    severity: 'low' | 'medium' | 'high';
  }[];

  // Behavioral drift analysis
  behavioralAnalysis: {
    calmMoments: number;
    triggeredMoments: number;
    overallTrend: 'improving' | 'stable' | 'declining';
  };

  // Final metrics
  finalMetrics: {
    psychologicalSafety: number;
    legalRisk: number;
    clarityOfFeedback: number;
  };

  // Recommendations for coach
  recommendations: string[];
}
