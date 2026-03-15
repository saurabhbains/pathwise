interface Scenario {
  id: string;
  name: string;
  description: string;
  characterName: string;
  characterRole: string;
  estimatedTime: string;
}

interface ScenarioSelectorProps {
  onSelectScenario: (scenarioId: string) => void;
  onBack?: () => void;
}

// Mock scenarios - these would come from API
const mockScenarios: Scenario[] = [
  {
    id: 'def-dev-001',
    name: 'Delivering Difficult Feedback',
    description: 'A mid-level engineer has missed multiple deadlines and is deflecting blame. Practice giving clear, specific feedback.',
    characterName: 'Alex Chen',
    characterRole: 'Software Engineer II',
    estimatedTime: '15-20 min'
  },
  {
    id: 'check-sen-001',
    name: 'Re-engaging a Disengaged Employee',
    description: 'A previously high-performing senior employee has become disengaged and their attitude is affecting team morale.',
    characterName: 'Jordan Martinez',
    characterRole: 'Senior Customer Success Manager',
    estimatedTime: '20-25 min'
  },
  {
    id: 'hp-bias-001',
    name: 'Navigating a Bias Complaint',
    description: 'Your top performer filed an HR complaint about bias. Navigate this sensitive conversation professionally.',
    characterName: 'Priya Sharma',
    characterRole: 'Senior ML Engineer',
    estimatedTime: '25-30 min'
  }
];

export default function ScenarioSelector({ onSelectScenario }: ScenarioSelectorProps) {

  const difficultyBadge: Record<string, string> = {
    'def-dev-001': 'Intermediate',
    'check-sen-001': 'Advanced',
    'hp-bias-001': 'Expert',
  };

  const difficultyColor: Record<string, string> = {
    'Intermediate': 'bg-amber-100 text-amber-700',
    'Advanced': 'bg-orange-100 text-orange-700',
    'Expert': 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Header */}
      <div className="bg-[#1E2D3D] border-b border-[#2E4057]">
        <div className="max-w-6xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/pathwiseicon_square.png" alt="Pathwise" className="w-10 h-10 rounded-xl shadow" />
              <img src="/pathwise_wordmark_white.png" alt="Pathwise" className="h-8" />
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-[#2E4057] rounded-lg p-1">
                <button className="px-4 py-1.5 bg-[#6366F1] text-white text-sm font-medium rounded-md shadow">
                  Learner
                </button>
                <button
                  onClick={() => window.location.href = '/coach'}
                  className="px-4 py-1.5 text-slate-300 hover:text-white text-sm font-medium rounded-md transition-colors"
                >
                  Coach
                </button>
              </div>
              <button
                onClick={() => window.location.href = '/history'}
                className="flex items-center space-x-1.5 px-4 py-2 bg-[#2E4057] hover:bg-[#3a5068] text-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>History</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-8 pt-12 pb-8">
        <div className="mb-2">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wide">Simulation Lab</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1E2D3D] mb-2">Practice difficult conversations</h1>
        <p className="text-slate-500 text-base max-w-xl">Choose a scenario below. Each simulation puts you in a real workplace situation with an AI-powered employee. Your performance is analyzed and sent to your coach.</p>
      </div>

      {/* Scenario Cards */}
      <div className="max-w-6xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {mockScenarios.map((scenario) => {
            const badge = difficultyBadge[scenario.id] || 'Intermediate';
            const badgeColor = difficultyColor[badge];
            return (
              <div
                key={scenario.id}
                className="bg-white rounded-2xl border border-[#E8E4DE] hover:border-[#6366F1] hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group"
              >
                {/* Card top accent */}
                <div className="h-1.5 bg-gradient-to-r from-[#6366F1] to-[#818CF8]" />

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>{badge}</span>
                    <span className="flex items-center text-xs text-slate-400 space-x-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{scenario.estimatedTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1E2D3D] mb-2 leading-snug">{scenario.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed flex-1">{scenario.description}</p>

                  <div className="mt-4 pt-4 border-t border-[#F0EDE8] flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center text-sm font-bold text-[#6366F1]">
                      {scenario.characterName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1E2D3D]">{scenario.characterName}</p>
                      <p className="text-xs text-slate-400">{scenario.characterRole}</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectScenario(scenario.id); }}
                    className="w-full py-2.5 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center space-x-2 group-hover:shadow-md"
                  >
                    <span>View Briefing</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

