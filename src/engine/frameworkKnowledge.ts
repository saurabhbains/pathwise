/**
 * Academic Framework Knowledge Base for Pathwise Simulation
 *
 * This document contains the theoretical underpinnings from MBA curricula
 * on Leadership, Negotiation, and Organizational Behavior that serve as
 * the "ground truth" for evaluating user performance.
 */

export const FRAMEWORK_KNOWLEDGE = {
  /**
   * Module 1: Power & Politics (Influence Dynamics)
   * Sources: Jeffrey Pfeffer, Robert Cialdini, French & Raven
   */
  powerAndPolitics: {
    positionalPower: {
      legitimate: {
        description: "Relying on formal authority ('I am the boss, so do it')",
        effect: "Creates short-term compliance but often triggers malicious obedience",
        psychologicalSafetyImpact: -15,
        keywords: ["have to", "must", "required", "mandate", "boss", "authority", "need you to"],
      },
      reward: {
        description: "Offering bonuses, raises, or perks",
        effect: "Creates transactional relationship - if rewards stop, performance stops",
        psychologicalSafetyImpact: -5,
        keywords: ["bonus", "raise", "promotion", "reward", "incentive", "if you do this"],
      },
      coercive: {
        description: "Threats of termination or consequences",
        effect: "Triggers fight-or-flight (amygdala hijack), psychological safety drops to near zero",
        psychologicalSafetyImpact: -40,
        legalRiskIncrease: 30,
        keywords: ["fire", "let you go", "terminate", "consequences", "or else", "warning", "unacceptable"],
      },
    },
    personalPower: {
      expert: {
        description: "Demonstrating expertise to help solve problems",
        effect: "High credibility - employee yields because they trust leader's competence",
        psychologicalSafetyImpact: 10,
        keywords: ["data shows", "in my experience", "I've seen", "help you", "solve this together"],
      },
      referent: {
        description: "Leveraging strong relationship and shared values",
        effect: "Strongest form of influence - employee yields through identification",
        psychologicalSafetyImpact: 20,
        keywords: ["we both", "our values", "relationship", "trust", "respect", "appreciate you"],
      },
      network: {
        description: "Connecting employee to key stakeholders",
        effect: "Highly effective on ambitious employees who value social capital",
        psychologicalSafetyImpact: 5,
        keywords: ["connect you", "introduce you", "visibility", "stakeholders", "network"],
      },
    },
    cialdiniPrinciples: {
      reciprocity: {
        description: "Trading favors or mentioning past support",
        keywords: ["helped you", "supported", "had your back", "return the favor"],
      },
      commitmentConsistency: {
        description: "Tying requests to person's past public promises",
        keywords: ["you said", "committed to", "promised", "told the team", "your goal was"],
      },
      socialProof: {
        description: "Using peer behavior to normalize request",
        keywords: ["everyone else", "the team", "others are", "peers", "industry standard"],
      },
      authority: {
        description: "Citing external mandates",
        keywords: ["CEO said", "policy states", "regulations require", "HR mandates"],
        risk: "Risky if employee is anti-establishment",
      },
      liking: {
        description: "Building rapport and safety before demands",
        keywords: ["how are you", "appreciate", "value", "respect", "admire"],
      },
      scarcity: {
        description: "Creating genuine urgency",
        keywords: ["deadline", "limited time", "opportunity closing", "now or never"],
      },
    },
  },

  /**
   * Module 2: Conflict Lab (Resolution Models)
   * Sources: Chris Argyris, Stone/Patton/Heen, TKI
   */
  conflictLab: {
    ladderOfInference: {
      rung1_data: {
        description: "Observable facts - what a camera would capture",
        examples: ["arrived at 9:15", "missed three deadlines", "logged in late"],
        psychologicalSafetyImpact: 5,
      },
      rung2_meaning: {
        description: "Interpretation of data",
        examples: ["you were late", "you missed deadlines"],
        psychologicalSafetyImpact: 0,
      },
      rung3_assumption: {
        description: "Assumptions about intentions",
        examples: ["you don't care", "you're not trying", "you're avoiding this"],
        psychologicalSafetyImpact: -15,
      },
      rung4_conclusion: {
        description: "Judgment and labeling",
        examples: ["you're lazy", "you're unprofessional", "you can't handle this", "you're not cut out"],
        psychologicalSafetyImpact: -30,
        legalRiskIncrease: 20,
      },
    },
    threeConversations: {
      whatHappened: {
        description: "Arguing over facts, logs, who said what",
        risk: "Getting stuck here leads to defensiveness",
        signals: ["but I", "actually", "that's not true", "you said", "I never"],
      },
      feelings: {
        description: "Acknowledging unexpressed emotions",
        goal: "Label the affect to lower tension",
        phrases: ["you seem frustrated", "I sense you're", "this must be", "I understand this is"],
      },
      identity: {
        description: "Internal question: Does this make me a bad person?",
        insight: "High defensiveness means you've threatened their identity",
        repair: "Validate identity while critiquing behavior",
        phrases: ["you're a high performer", "I know you care", "you have great skills"],
      },
    },
    tkiConflictModes: {
      competing: "High assertiveness, low cooperation - 'my way or highway'",
      accommodating: "Low assertiveness, high cooperation - 'whatever you want'",
      avoiding: "Low assertiveness, low cooperation - delaying the issue",
      collaborating: "High assertiveness, high cooperation - TARGET STATE",
      compromising: "Medium assertiveness, medium cooperation - splitting difference",
    },
  },

  /**
   * Module 3: The Coaching Rubric (Feedback Quality)
   * Sources: SBI Model, Kim Scott, Amy Edmondson
   */
  coachingRubric: {
    sbiFramework: {
      situation: {
        description: "Specific time and place",
        required: true,
        examples: ["in yesterday's meeting", "last Tuesday", "during the client call"],
        missing: "Vague feedback is a legal risk",
      },
      behavior: {
        description: "Observable action",
        required: true,
        examples: ["interrupted three times", "arrived 15 minutes late", "didn't complete the report"],
        avoid: ["you were rude", "you had a bad attitude"] // These are interpretations, not behaviors
      },
      impact: {
        description: "Consequence of the behavior",
        required: true,
        examples: ["caused client to disengage", "delayed the project", "team couldn't proceed"],
      },
    },
    radicalCandor: {
      radicalCandor: {
        carePersonally: true,
        challengeDirectly: true,
        description: "The goal - caring personally while challenging directly",
      },
      obnoxiousAggression: {
        carePersonally: false,
        challengeDirectly: true,
        description: "Challenging without care - bullying/berating",
        signals: ["harsh tone", "no empathy", "attacking character"],
      },
      ruinousEmpathy: {
        carePersonally: true,
        challengeDirectly: false,
        description: "Caring without challenge - sugarcoating/avoiding",
        signals: ["it's okay", "no big deal", "don't worry about it"],
      },
      manipulativeInsincerity: {
        carePersonally: false,
        challengeDirectly: false,
        description: "Neither caring nor challenging - passive-aggressive",
        signals: ["backhanded compliments", "sarcasm", "gossip"],
      },
    },
    growModel: {
      goal: "Was the objective defined?",
      reality: "Did they discuss current obstacles?",
      options: "Did they brainstorm solutions together?",
      will: "Did they commit to specific next steps?",
    },
  },

  /**
   * Module 4: Emotional Intelligence
   * Source: Daniel Goleman
   */
  emotionalIntelligence: {
    selfRegulation: {
      impulseControl: "Stay calm when employee becomes defensive",
      avoidMirroring: "Don't mirror employee's anger or speed",
      useThePause: "Utilize silence to let employee vent",
    },
    empathy: {
      cognitive: {
        description: "Understanding employee's perspective",
        phrases: ["I can see why you", "from your view", "I understand that"],
      },
      emotional: {
        description: "Feeling employee's distress",
        phrases: ["I'm sorry this is stressful", "this must be hard", "I feel for you"],
      },
      inquiry: {
        good: ["What's your perspective?", "Help me understand", "What would work for you?"],
        bad: ["Why did you do this?", "What were you thinking?", "Don't you agree?"],
      },
    },
  },
};

/**
 * Evaluation Helpers
 */

export function detectPowerType(managerInput: string): {
  type: 'positional' | 'personal' | 'mixed' | 'neutral';
  specific: string[];
  psychologicalSafetyImpact: number;
  legalRiskIncrease: number;
} {
  const input = managerInput.toLowerCase().trim();

  // Check if this is a neutral/greeting/rapport-building statement
  const neutralPatterns = [
    /^(hi|hey|hello|good morning|good afternoon)/,
    /^how are you/,
    /^thanks|thank you/,
    /^let's talk|let's discuss/,
    /^i wanted to (talk|chat|discuss|meet)/,
    /^do you have (a )?minute/,
  ];

  const isNeutral = neutralPatterns.some(pattern => pattern.test(input)) || input.length < 15;

  if (isNeutral) {
    return { type: 'neutral', specific: [], psychologicalSafetyImpact: 0, legalRiskIncrease: 0 };
  }

  let psychologicalSafetyImpact = 0;
  let legalRiskIncrease = 0;
  const detected: string[] = [];

  // Check positional power
  Object.entries(FRAMEWORK_KNOWLEDGE.powerAndPolitics.positionalPower).forEach(([key, power]) => {
    if (power.keywords.some(keyword => input.includes(keyword))) {
      detected.push(`positional_${key}`);
      psychologicalSafetyImpact += power.psychologicalSafetyImpact;
      if ((power as any).legalRiskIncrease) legalRiskIncrease += (power as any).legalRiskIncrease;
    }
  });

  // Check personal power
  Object.entries(FRAMEWORK_KNOWLEDGE.powerAndPolitics.personalPower).forEach(([key, power]) => {
    if (power.keywords.some(keyword => input.includes(keyword))) {
      detected.push(`personal_${key}`);
      psychologicalSafetyImpact += power.psychologicalSafetyImpact;
    }
  });

  const positionalCount = detected.filter(d => d.startsWith('positional')).length;
  const personalCount = detected.filter(d => d.startsWith('personal')).length;

  let type: 'positional' | 'personal' | 'mixed' | 'neutral';
  if (detected.length === 0) type = 'neutral';
  else if (positionalCount > 0 && personalCount === 0) type = 'positional';
  else if (personalCount > 0 && positionalCount === 0) type = 'personal';
  else type = 'mixed';

  return { type, specific: detected, psychologicalSafetyImpact, legalRiskIncrease };
}

export function detectCialdiniPrinciple(managerInput: string): string[] {
  const input = managerInput.toLowerCase();
  const detected: string[] = [];

  Object.entries(FRAMEWORK_KNOWLEDGE.powerAndPolitics.cialdiniPrinciples).forEach(([key, principle]) => {
    if (principle.keywords.some(keyword => input.includes(keyword))) {
      detected.push(key);
    }
  });

  return detected;
}

export function detectLadderRung(managerInput: string): {
  rung: 1 | 2 | 3 | 4;
  impact: number;
  legalRisk: number;
} {
  const input = managerInput.toLowerCase();
  const { ladderOfInference } = FRAMEWORK_KNOWLEDGE.conflictLab;

  // Check from highest (worst) to lowest
  const rung4Match = ladderOfInference.rung4_conclusion.examples.some(ex => input.includes(ex));
  if (rung4Match) {
    return {
      rung: 4,
      impact: ladderOfInference.rung4_conclusion.psychologicalSafetyImpact,
      legalRisk: ladderOfInference.rung4_conclusion.legalRiskIncrease,
    };
  }

  const rung3Match = ladderOfInference.rung3_assumption.examples.some(ex => input.includes(ex));
  if (rung3Match) {
    return {
      rung: 3,
      impact: ladderOfInference.rung3_assumption.psychologicalSafetyImpact,
      legalRisk: 0,
    };
  }

  // Check for specific observable data (rung 1)
  const rung1Match = ladderOfInference.rung1_data.examples.some(ex => input.includes(ex)) ||
    /\b\d+:\d+\b/.test(input) || // time references
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/.test(input) || // day references
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/.test(input); // month references

  if (rung1Match) {
    return {
      rung: 1,
      impact: ladderOfInference.rung1_data.psychologicalSafetyImpact,
      legalRisk: 0,
    };
  }

  // Default to rung 2 (meaning/interpretation)
  return {
    rung: 2,
    impact: ladderOfInference.rung2_meaning.psychologicalSafetyImpact,
    legalRisk: 0,
  };
}

export function evaluateSBI(managerInput: string): {
  hasSituation: boolean;
  hasBehavior: boolean;
  hasImpact: boolean;
  score: number;
} {
  const input = managerInput.toLowerCase();
  const { sbiFramework } = FRAMEWORK_KNOWLEDGE.coachingRubric;

  const hasSituation = sbiFramework.situation.examples.some(ex => input.includes(ex)) ||
    /\b(yesterday|last week|this morning|on \w+day)\b/.test(input);

  const hasBehavior = sbiFramework.behavior.examples.some(ex => input.includes(ex));

  const hasImpact = sbiFramework.impact.examples.some(ex => input.includes(ex)) ||
    input.includes('caused') || input.includes('resulted') || input.includes('led to');

  let score = 0;
  if (hasSituation) score += 33;
  if (hasBehavior) score += 33;
  if (hasImpact) score += 34;

  return { hasSituation, hasBehavior, hasImpact, score };
}

export function detectConversationLayer(managerInput: string): 'what_happened' | 'feelings' | 'identity' {
  const input = managerInput.toLowerCase();
  const { threeConversations } = FRAMEWORK_KNOWLEDGE.conflictLab;

  // Check for identity validation
  if (threeConversations.identity.phrases.some(phrase => input.includes(phrase))) {
    return 'identity';
  }

  // Check for feelings acknowledgment
  if (threeConversations.feelings.phrases.some(phrase => input.includes(phrase))) {
    return 'feelings';
  }

  // Check for what-happened signals (defensiveness triggers)
  if (threeConversations.whatHappened.signals.some(signal => input.includes(signal))) {
    return 'what_happened';
  }

  // Default to what_happened if arguing facts
  return 'what_happened';
}
