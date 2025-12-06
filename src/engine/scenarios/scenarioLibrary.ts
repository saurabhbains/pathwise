// Rich Scenario Library - Story-based leadership simulations

import {
  Scenario,
  ScenarioType,
  ScenarioDifficulty,
  SkillTag,
  PersonaType,
  type OrgContext,
  type CharacterBio,
  type SituationBrief,
  type HiddenGoals
} from '../scenarioTypes.js';

// ============================================================================
// SCENARIO 1: The Defensive Developer (Novice)
// ============================================================================

export const defensiveDeveloper: Scenario = {
  id: 'def-dev-001',
  type: ScenarioType.PERFORMANCE_REVIEW,
  name: 'The Defensive Developer',
  description: 'A mid-level engineer has missed multiple deadlines and is deflecting blame. Practice giving clear, specific feedback without triggering defensiveness.',
  difficulty: ScenarioDifficulty.NOVICE,
  skillTags: [SkillTag.DIFFICULT_FEEDBACK, SkillTag.PERFORMANCE_PIP],
  coachingFramework: 'SBI', // Situation-Behavior-Impact

  orgContext: {
    companyName: 'TechFlow Solutions',
    companySize: '150-person startup',
    industry: 'SaaS',
    teamName: 'Platform Engineering',
    teamSize: 8,
    recentEvents: [
      'Major product launch 3 months ago (high pressure)',
      'Team lost 2 senior engineers in last 6 months',
      'New VP of Engineering joined 2 months ago with higher standards'
    ],
    performanceHistory: 'Alex was a solid performer for first 18 months. Performance declined sharply in Q3-Q4 this year.'
  },

  characterBio: {
    name: 'Alex Chen',
    role: 'Software Engineer II',
    tenure: '2 years',
    personaType: PersonaType.DEFENSIVE,

    motivations: [
      'Wants to be seen as a valuable team member',
      'Fears being seen as incompetent',
      'Trying to protect reputation after past successes'
    ],

    stressors: [
      'Working on unfamiliar parts of codebase after team restructure',
      'Feeling overwhelmed by increased expectations from new VP',
      'Watching peers get promoted while they stagnate',
      'Comparing themselves to departed senior engineers'
    ],

    priorFeedback: [
      '6 months ago: "Great work on the API redesign" (positive)',
      '3 months ago: Informal comment about missing a deadline (brushed off)',
      '1 month ago: Brief mention of code quality in 1:1 (got defensive, you backed off)'
    ],

    identityDimensions: 'First-generation college graduate, feels pressure to succeed',
    personalCircumstances: 'Recently moved to expensive apartment, financial pressure',

    communicationStyle: 'Initially polite but quickly becomes defensive. Deflects blame to external factors (tools, requirements, other people). Focuses on intentions rather than outcomes.',

    triggerPoints: [
      'Being compared to others',
      'Vague criticism without specific examples',
      'Feeling like their efforts aren\'t recognized',
      'Perception of personal attacks vs. behavior feedback'
    ]
  },

  situationBrief: {
    whatHappened: 'Alex has missed deadlines on 3 major projects in the last quarter. Code quality has declined (increased bug count, longer code review cycles). Team members have privately mentioned communication issues and lack of collaboration.',
    
    managerGoal: 'Get Alex to acknowledge the performance issues and agree on a concrete improvement plan. Document the conversation for potential PIP.',
    
    constraints: [
      'You have 30 minutes scheduled',
      'This is a formal performance discussion (documented)',
      'You need Alex\'s buy-in for this to work',
      'HR wants documentation before any PIP'
    ],
    
    riskFactors: [
      'Alex may quit if handled poorly (creates team burden)',
      'Alex may file complaint if they feel attacked',
      'If too soft, performance continues to slide',
      'Other team members are watching how you handle this'
    ]
  },

  hiddenGoals: {
    primaryGoal: 'Get explicit acknowledgment of performance issues and commitment to improvement plan',
    
    secondaryGoals: [
      'Understand root causes (capability vs. motivation vs. circumstances)',
      'Preserve relationship enough that Alex stays engaged',
      'Document conversation appropriately for HR'
    ],
    
    relationshipGoal: 'Keep Alex feeling respected and capable of improvement, not attacked or hopeless',
    
    legalConsiderations: [
      'Avoid vague language like "attitude problem" or "not fitting in"',
      'Provide specific, documented examples with dates',
      'Focus on behaviors and outcomes, not personality',
      'No assumptions about personal circumstances affecting work'
    ],
    
    idealOutcome: 'Alex acknowledges the performance gap, shares what\'s blocking them, and you co-create a 30-60-90 day improvement plan with clear milestones. Alex leaves feeling challenged but supported, not attacked.'
  },

  defaultContext: {
    employeeName: 'Alex Chen',
    employeeRole: 'Software Engineer II',
    situationBrief: `You are about to conduct a performance review with a team member who has been underperforming.

Key Issues:
- Missed deadlines on 3 major projects in the last quarter
- Quality of work has declined (increased bug count, code review feedback)
- Team members have reported communication issues and lack of collaboration
- Employee seems disengaged in team meetings

Your goal is to:
1. Address the performance concerns clearly and specifically
2. Understand the root causes
3. Create an improvement plan
4. Maintain psychological safety while being direct

The employee may be defensive, make excuses, or deflect blame.`
  },

  objectives: [
    'Deliver specific, behavior-based feedback using the SBI framework',
    'Navigate defensiveness without backing down on key issues',
    'Co-create an actionable improvement plan',
    'Maintain psychological safety while being direct'
  ],

  successCriteria: {
    minTurns: 5,
    maxLegalRisk: 40,
    minPsychologicalSafety: 60,
    minClarityScore: 70,
    noRedSpikesAfterTurn: 3
  }
};

// ============================================================================
// SCENARIO 2: The Checked-Out Senior (Intermediate)
// ============================================================================

export const checkedOutSenior: Scenario = {
  id: 'check-sen-001',
  type: ScenarioType.FEEDBACK_DELIVERY,
  name: 'The Checked-Out Senior',
  description: 'A previously high-performing senior employee has become disengaged. They\'re doing minimum work and their attitude is affecting team morale.',
  difficulty: ScenarioDifficulty.INTERMEDIATE,
  skillTags: [SkillTag.DIFFICULT_FEEDBACK, SkillTag.TEAM_DYNAMICS],
  coachingFramework: 'GROW',

  orgContext: {
    companyName: 'DataSync Corp',
    companySize: '400-person mid-market company',
    industry: 'Enterprise Software',
    teamName: 'Customer Success',
    teamSize: 12,
    recentEvents: [
      'Company pivoted strategy 6 months ago (away from Jordan\'s area of expertise)',
      'New manager hired above Jordan (external hire)',
      'Jordan was passed over for promotion to that role',
      'Team restructured, Jordan lost 2 direct reports'
    ],
    performanceHistory: 'Star performer for 4 years. Went from exceeding expectations to "meets expectations" in last 2 quarters.'
  },

  characterBio: {
    name: 'Jordan Martinez',
    role: 'Senior Customer Success Manager',
    tenure: '4.5 years',
    personaType: PersonaType.CHECKED_OUT,

    motivations: [
      'Used to be motivated by impact and growth',
      'Now feels stuck and unappreciated',
      'Considering leaving but inertia keeps them here'
    ],

    stressors: [
      'Feeling betrayed after being passed over for promotion',
      'New manager doesn\'t understand their contributions',
      'Watching company move away from work they built',
      'Golden handcuffs (equity vesting in 8 months)'
    ],

    priorFeedback: [
      '1 year ago: "Exceeds expectations - promotion candidate" ',
      '6 months ago: Told they didn\'t get the manager role (brief conversation)',
      '3 months ago: Mentioned to new manager they feel underutilized (dismissed)',
      '1 month ago: Informal feedback about being quiet in meetings (shrugged off)'
    ],

    identityDimensions: 'Built much of the early customer success playbook, feels ownership',
    personalCircumstances: 'Golden handcuffs - significant equity vesting soon',

    communicationStyle: 'Polite but emotionally distant. Gives minimal responses. Shows resignation rather than anger. May express cynicism about company direction.',

    triggerPoints: [
      'Being told they need to "step up" when they feel abandoned',
      'Lack of acknowledgment of past contributions',
      'Generic motivational talk without addressing real issues',
      'Feeling like they\'re being managed out'
    ]
  },

  situationBrief: {
    whatHappened: 'Jordan is doing bare minimum - showing up to meetings but not contributing, delivering work on time but without their usual excellence, and their lack of energy is noticed by teammates. Two junior team members mentioned Jordan\'s negativity affecting them.',
    
    managerGoal: 'Re-engage Jordan OR help them decide to leave gracefully. Can\'t have them stay in this state.',
    
    constraints: [
      'You need Jordan\'s expertise for Q1 customer renewals',
      'Can\'t force them to leave (unemployment claim risk)',
      'You\'re new to the team (only 3 months) - limited relationship capital',
      'Jordan knows more about customers than you do'
    ],
    
    riskFactors: [
      'Jordan could start actively harming morale',
      'Could lose Jordan before finding replacement',
      'Other team members may follow if Jordan leaves',
      'Mishandling could lead to retaliation/sabotage'
    ]
  },

  hiddenGoals: {
    primaryGoal: 'Determine if Jordan can re-engage OR facilitate graceful exit',
    
    secondaryGoals: [
      'Understand what would make Jordan engaged again (if anything)',
      'Assess if this is fixable or terminal',
      'Protect team morale regardless of outcome'
    ],
    
    relationshipGoal: 'Rebuild enough trust that Jordan will be honest about what they want',
    
    legalConsiderations: [
      'Don\'t constructively discharge (push them to quit)',
      'Don\'t retaliate for past complaints about being passed over',
      'Document performance issues with specific examples',
      'Be open to reasonable accommodations if personal issues exist'
    ],
    
    idealOutcome: 'Jordan shares what happened to their motivation. Together you identify a path forward (new projects, scope change, timeline to leave) that works for both. Jordan either re-engages or you part ways professionally.'
  },

  defaultContext: {
    employeeName: 'Jordan Martinez',
    employeeRole: 'Senior Customer Success Manager',
    situationBrief: 'Jordan, a previously star performer, has become disengaged over the past 6 months.'
  },

  objectives: [
    'Use GROW framework to explore Jordan\'s situation',
    'Navigate difficult conversation about disengagement',
    'Determine path forward (re-engage or graceful exit)',
    'Maintain respect for past contributions while addressing current issues'
  ],

  successCriteria: {
    minTurns: 7,
    maxLegalRisk: 30,
    minPsychologicalSafety: 70,
    minClarityScore: 65
  }
};

// ============================================================================
// SCENARIO 3: The High Performer with Bias Complaint (Advanced)
// ============================================================================

export const highPerformerBiasComplaint: Scenario = {
  id: 'hp-bias-001',
  type: ScenarioType.CONFLICT_RESOLUTION,
  name: 'The High Performer with a Bias Complaint',
  description: 'Your top performer filed an HR complaint about bias in project assignments. Now you need to address their concerns while maintaining standards.',
  difficulty: ScenarioDifficulty.ADVANCED,
  skillTags: [SkillTag.DEI_TOPIC, SkillTag.CONFLICT_RESOLUTION, SkillTag.CAREER_DEVELOPMENT],
  coachingFramework: 'CBIN', // Context-Behavior-Impact-Next Steps

  orgContext: {
    companyName: 'Innovate Labs',
    companySize: '800-person tech company',
    industry: 'AI/ML',
    teamName: 'Machine Learning Research',
    teamSize: 15,
    recentEvents: [
      'Company-wide DEI training 3 months ago',
      'Two senior women left the company citing culture issues (6 months ago)',
      'New "high-visibility project" assignments announced last month',
      'Priya was not selected for the high-visibility AI ethics project'
    ],
    performanceHistory: 'Consistently top performer. Exceeds expectations every review. Published papers, strong peer reviews.'
  },

  characterBio: {
    name: 'Priya Sharma',
    role: 'Senior ML Engineer',
    tenure: '3 years',
    personaType: PersonaType.HIGH_PERFORMER,

    motivations: [
      'Driven by challenging, impactful work',
      'Wants to advance to Staff Engineer level',
      'Values being seen as a technical leader',
      'Cares deeply about representation and inclusion'
    ],

    stressors: [
      'Watching less experienced (white male) peers get high-profile projects',
      'Recent pattern of being assigned "glue work" vs. technical leadership',
      'Feeling she has to be perfect while others get second chances',
      'Pressure from family to leave for higher-paying FAANG role'
    ],

    priorFeedback: [
      '6 months ago: "Exceeds expectations - on track for Staff promotion"',
      '4 months ago: Asked about AI ethics project - told "we need you on platform stability" (felt like excuse)',
      '2 months ago: Informal complaint to you about project assignments (you said you\'d look into it)',
      '1 month ago: Formal HR complaint filed citing pattern of bias'
    ],

    identityDimensions: 'Woman of color in male-dominated field. First in family to work in tech.',
    personalCircumstances: 'Turning down recruiter offers to stay, questioning that decision',

    communicationStyle: 'Professional and direct, but underlying frustration. Will cite specific examples. May use terms like "pattern" and "systemic." Expects you to take it seriously.',

    triggerPoints: [
      'Dismissing her concerns as "perception"',
      'Defending other employees rather than listening',
      'Tokenizing or making assumptions about her experience',
      'Making promises you don\'t keep'
    ]
  },

  situationBrief: {
    whatHappened: 'Priya filed a formal complaint: "Over the past year, I\'ve been consistently passed over for high-visibility projects despite my performance. Meanwhile, less experienced male colleagues have been given these opportunities. I believe there is a pattern of bias in project assignments."',
    
    managerGoal: 'Address Priya\'s concerns seriously, determine if there\'s validity, and find a path forward that retains her while maintaining fairness.',
    
    constraints: [
      'HR is watching this closely (recent DEI issues)',
      'You need to take complaint seriously while staying factual',
      'Can\'t make promises about specific projects without team input',
      'Other team members will hear about how this is handled'
    ],
    
    riskFactors: [
      'Priya could leave and make this public (Glassdoor, social media)',
      'Mishandling could lead to formal legal complaint',
      'Other underrepresented team members are watching',
      'If you over-correct, may create perception of favoritism'
    ]
  },

  hiddenGoals: {
    primaryGoal: 'Understand Priya\'s specific concerns and determine if there\'s a pattern that needs addressing',
    
    secondaryGoals: [
      'Assess your own potential blind spots in project assignments',
      'Find immediate and long-term actions to address concerns',
      'Rebuild trust with Priya',
      'Use this as opportunity to improve team processes'
    ],
    
    relationshipGoal: 'Show Priya she\'s valued and heard, while being honest about what you can and can\'t control',
    
    legalConsiderations: [
      'This is now documented with HR - be very careful',
      'Don\'t retaliate or create hostile environment',
      'Don\'t make assumptions about what Priya wants based on identity',
      'Focus on specific behaviors and project assignment criteria',
      'Don\'t promise outcomes you can\'t guarantee'
    ],
    
    idealOutcome: 'Priya feels heard and sees concrete actions (not just words). You identify any actual bias in processes and commit to changes. Priya stays engaged while you work on systemic improvements. You emerge with better project assignment transparency.'
  },

  defaultContext: {
    employeeName: 'Priya Sharma',
    employeeRole: 'Senior ML Engineer',
    situationBrief: 'Priya, a top performer, filed an HR complaint about bias in project assignments.'
  },

  objectives: [
    'Listen to and validate concerns without being defensive',
    'Use CBIN framework to explore specific situations',
    'Distinguish between perception and pattern',
    'Create concrete action plan to address concerns',
    'Navigate DEI topic with cultural competence'
  ],

  successCriteria: {
    minTurns: 8,
    maxLegalRisk: 20, // Very low tolerance given HR involvement
    minPsychologicalSafety: 80, // Need high safety for this topic
    minClarityScore: 75,
    noRedSpikesAfterTurn: 2 // Must stay careful throughout
  }
};

// ============================================================================
// SCENARIO LIBRARY EXPORT
// ============================================================================

export const scenarioLibrary: Scenario[] = [
  defensiveDeveloper,
  checkedOutSenior,
  highPerformerBiasComplaint
];

export const getScenariosBySkill = (skill: SkillTag): Scenario[] => {
  return scenarioLibrary.filter(s => s.skillTags.includes(skill));
};

export const getScenariosByDifficulty = (difficulty: ScenarioDifficulty): Scenario[] => {
  return scenarioLibrary.filter(s => s.difficulty === difficulty);
};

export const getScenarioById = (id: string): Scenario | undefined => {
  return scenarioLibrary.find(s => s.id === id);
};


