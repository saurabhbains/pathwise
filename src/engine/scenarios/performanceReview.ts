// Performance Review Scenario Definition

import {
  Scenario,
  ScenarioType,
  ScenarioDifficulty,
  SkillTag,
  PersonaType
} from '../scenarioTypes.js';

export const performanceReviewScenario: Scenario = {
  id: 'perf-review-001',
  type: ScenarioType.PERFORMANCE_REVIEW,
  name: 'The Difficult Performance Review',
  description: 'Navigate a challenging performance review conversation with an underperforming employee who is defensive and resistant to feedback.',
  difficulty: ScenarioDifficulty.INTERMEDIATE,
  skillTags: [SkillTag.DIFFICULT_FEEDBACK, SkillTag.PERFORMANCE_PIP],
  coachingFramework: 'SBI',

  // Rich storyline (basic version for backward compatibility)
  orgContext: {
    companyName: 'Tech Company',
    companySize: 'Mid-size company',
    industry: 'Technology',
    teamName: 'Engineering',
    teamSize: 10,
    recentEvents: ['High pressure quarter with multiple project deadlines'],
    performanceHistory: 'Previously solid performer, recent decline in last quarter'
  },

  characterBio: {
    name: 'Alex',
    role: 'Senior Software Engineer (Level 4)',
    tenure: '2 years',
    personaType: PersonaType.DEFENSIVE,
    motivations: ['Wants to succeed', 'Fears failure'],
    stressors: ['Workload', 'Team dynamics'],
    priorFeedback: ['Previous informal mentions of missed deadlines'],
    communicationStyle: 'Defensive, deflects blame',
    triggerPoints: ['Vague criticism', 'Feeling attacked']
  },

  situationBrief: {
    whatHappened: 'Missed deadlines on 3 major projects, declined code quality, communication issues with team',
    managerGoal: 'Address performance issues and create improvement plan',
    constraints: ['Need to document for potential PIP', 'Maintain team morale'],
    riskFactors: ['Employee may quit', 'Could file complaint if mishandled']
  },

  hiddenGoals: {
    primaryGoal: 'Get acknowledgment of issues and commitment to improve',
    secondaryGoals: ['Understand root causes', 'Document appropriately'],
    relationshipGoal: 'Keep employee engaged and motivated',
    legalConsiderations: ['Avoid vague language', 'Provide specific examples', 'Focus on behaviors not personality'],
    idealOutcome: 'Employee acknowledges issues, co-creates improvement plan, leaves feeling challenged but supported'
  },

  defaultContext: {
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

The employee may be defensive, make excuses, or deflect blame.`,

    employeeHandbook: `COMPANY PERFORMANCE MANAGEMENT POLICY

1. PROHIBITED LANGUAGE & BEHAVIORS:
   - Subjective/vague criticism: "bad attitude", "not fitting in", "cultural issues"
   - Personal attacks or character judgments
   - References to protected characteristics (age, race, gender, religion, etc.)
   - Threats without documented progressive discipline
   - Discussing performance of other employees

2. REQUIRED PRACTICES:
   - Provide specific, documented examples with dates
   - Focus on observable behaviors and measurable outcomes, not personality
   - Offer clear, actionable improvement steps with timeline
   - Document all performance discussions in writing
   - Allow employee to respond and share their perspective
   - Follow progressive discipline: verbal warning → written warning → PIP → termination

3. LEGAL RISK AREAS (IMMEDIATE FLAGS):
   - Discrimination based on protected classes
   - Retaliation for prior complaints or protected activities
   - Harassment or hostile work environment language
   - Wrongful termination setup (skipping progressive discipline)
   - Disability accommodation failures

4. BEST PRACTICES:
   - Use "I observed..." or "The data shows..." not "You are..."
   - Ask open-ended questions to understand the employee's perspective
   - Cite specific examples: dates, projects, metrics
   - Separate behavior from person ("The deliverable was late" vs "You're always late")
   - Focus on future improvement, not dwelling on past failures
   - Offer support and resources (training, mentorship, tools)

5. DOCUMENTATION REQUIREMENTS:
   - Date and time of conversation
   - Specific issues discussed with examples
   - Employee's response and perspective
   - Agreed-upon action items and timeline
   - Follow-up meeting scheduled`,

    toneGuide: `COMPANY CULTURE: Direct and Transparent Communication

Our company values:
- Radical candor: Care personally, challenge directly
- Transparency over politeness
- Growth mindset: Feedback is a gift
- Psychological safety: It's safe to make mistakes and learn

Communication style:
- Be direct but respectful
- Don't sugarcoat issues, but maintain empathy
- Ask questions to understand before assuming
- Focus on solutions, not blame
- Acknowledge good work alongside areas for improvement`,

    competencyMatrix: `SENIOR SOFTWARE ENGINEER (LEVEL 4) COMPETENCY MATRIX

Technical Excellence:
- Consistently delivers high-quality, well-tested code
- Anticipates edge cases and potential issues
- Follows team coding standards and best practices
- Contributes to technical architecture decisions

Execution & Delivery:
- Meets deadlines reliably or communicates early when at risk
- Breaks down complex problems into manageable tasks
- Estimates work accurately
- Delivers incrementally with regular progress updates

Collaboration & Communication:
- Actively participates in team discussions and meetings
- Provides constructive code review feedback
- Responds to messages and requests in a timely manner
- Shares knowledge and helps unblock teammates
- Communicates proactively about blockers or challenges

Leadership & Impact:
- Mentors junior engineers
- Identifies process improvements
- Takes ownership of outcomes, not just tasks
- Demonstrates initiative beyond assigned work`,

    employeeName: 'Alex',
    employeeRole: 'Senior Software Engineer (Level 4)',
    managerName: 'Manager'
  },

  objectives: [
    'Deliver specific, actionable feedback without using vague or biased language',
    'Maintain psychological safety while addressing serious performance issues',
    'Avoid legal risks (discrimination, harassment, retaliation)',
    'Create a clear improvement plan with measurable goals',
    'Understand the employee\'s perspective and potential underlying issues',
    'Document the conversation appropriately'
  ],

  successCriteria: {
    minTurns: 5,
    maxLegalRisk: 30,
    minPsychologicalSafety: 50,
    minClarityScore: 70
  }
};
