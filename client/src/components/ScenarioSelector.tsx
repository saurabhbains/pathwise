import { useState } from 'react';

interface Scenario {
  id: string;
  name: string;
  description: string;
  difficulty: 'novice' | 'intermediate' | 'advanced';
  skillTags: string[];
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
    name: 'The Defensive Developer',
    description: 'A mid-level engineer has missed multiple deadlines and is deflecting blame. Practice giving clear, specific feedback.',
    difficulty: 'novice',
    skillTags: ['difficult_feedback', 'performance_pip'],
    characterName: 'Alex Chen',
    characterRole: 'Software Engineer II',
    estimatedTime: '15-20 min'
  },
  {
    id: 'check-sen-001',
    name: 'The Checked-Out Senior',
    description: 'A previously high-performing senior employee has become disengaged and their attitude is affecting team morale.',
    difficulty: 'intermediate',
    skillTags: ['difficult_feedback', 'team_dynamics'],
    characterName: 'Jordan Martinez',
    characterRole: 'Senior Customer Success Manager',
    estimatedTime: '20-25 min'
  },
  {
    id: 'hp-bias-001',
    name: 'The High Performer with a Bias Complaint',
    description: 'Your top performer filed an HR complaint about bias. Navigate this sensitive conversation professionally.',
    difficulty: 'advanced',
    skillTags: ['dei_topic', 'conflict_resolution', 'career_development'],
    characterName: 'Priya Sharma',
    characterRole: 'Senior ML Engineer',
    estimatedTime: '25-30 min'
  }
];

const skillCategories = [
  { id: 'difficult_feedback', name: 'Difficult Feedback', icon: '💬', color: 'blue' },
  { id: 'performance_pip', name: 'Performance & PIP', icon: '📊', color: 'yellow' },
  { id: 'dei_topic', name: 'DEI Topics', icon: '🌍', color: 'purple' },
  { id: 'conflict_resolution', name: 'Conflict Resolution', icon: '🤝', color: 'green' }
];

export default function ScenarioSelector({ onSelectScenario, onBack }: ScenarioSelectorProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const filteredScenarios = mockScenarios.filter(scenario => {
    const matchesSkill = !selectedSkill || scenario.skillTags.includes(selectedSkill);
    const matchesDifficulty = !selectedDifficulty || scenario.difficulty === selectedDifficulty;
    return matchesSkill && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'novice': return 'text-green-700 bg-green-100 border-green-300';
      case 'intermediate': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'advanced': return 'text-red-700 bg-red-100 border-red-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'novice': return '⭐';
      case 'intermediate': return '⭐⭐';
      case 'advanced': return '⭐⭐⭐';
      default: return '';
    }
  };

  const getSkillColor = (skillId: string) => {
    const skill = skillCategories.find(s => s.id === skillId);
    return skill?.color || 'gray';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3D5A80] to-[#98C1D9] rounded-2xl flex items-center justify-center transform hover:rotate-6 transition-transform shadow-lg">
                <span className="text-3xl">🎯</span>
              </div>
              <div>
                <h1 className="text-4xl font-black text-[#293241] mb-1 tracking-tight">Scenario Library</h1>
                <p className="text-lg text-[#3D5A80] font-medium">Choose your adventure in difficult conversations</p>
              </div>
            </div>
            
            {/* Mode Switcher */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-[#E0FBFC] rounded-xl p-1 border-2 border-[#98C1D9]">
                <button
                  className="px-4 py-2 bg-white text-[#3D5A80] rounded-lg font-bold shadow-md"
                >
                  🎓 Learner
                </button>
                <button
                  onClick={() => window.location.href = '/coach'}
                  className="px-4 py-2 text-[#3D5A80] hover:bg-white rounded-lg font-bold transition-colors"
                >
                  👨‍🏫 Coach
                </button>
              </div>
            </div>
          </div>

          {/* Skill Filter Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedSkill(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedSkill === null
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-400'
              }`}
            >
              All Skills
            </button>
            {skillCategories.map((skill) => (
              <button
                key={skill.id}
                onClick={() => setSelectedSkill(skill.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center space-x-2 ${
                  selectedSkill === skill.id
                    ? `bg-${skill.color}-600 text-white shadow-md`
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-400'
                }`}
              >
                <span>{skill.icon}</span>
                <span>{skill.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Difficulty Filter */}
        <div className="mb-6 flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Difficulty:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedDifficulty(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedDifficulty === null
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setSelectedDifficulty('novice')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedDifficulty === 'novice'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-400'
              }`}
            >
              ⭐ Novice
            </button>
            <button
              onClick={() => setSelectedDifficulty('intermediate')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedDifficulty === 'intermediate'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-yellow-400'
              }`}
            >
              ⭐⭐ Intermediate
            </button>
            <button
              onClick={() => setSelectedDifficulty('advanced')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedDifficulty === 'advanced'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-red-400'
              }`}
            >
              ⭐⭐⭐ Advanced
            </button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 mb-4">
          {filteredScenarios.length} scenario{filteredScenarios.length !== 1 ? 's' : ''} found
        </p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary-400 transform hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{scenario.name}</h3>
                    <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(scenario.difficulty)}`}>
                      <span>{getDifficultyIcon(scenario.difficulty)}</span>
                      <span>{scenario.difficulty.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{scenario.description}</p>

                {/* Character Info */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {scenario.characterName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{scenario.characterName}</p>
                    <p className="text-xs text-gray-600 truncate">{scenario.characterRole}</p>
                  </div>
                </div>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {scenario.skillTags.map((tag) => {
                    const skill = skillCategories.find(s => s.id === tag);
                    return (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-1 rounded-md bg-${getSkillColor(tag)}-100 text-${getSkillColor(tag)}-700 font-medium`}
                      >
                        {skill?.icon} {skill?.name || tag.replace(/_/g, ' ')}
                      </span>
                    );
                  })}
                </div>

                {/* Time Estimate */}
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{scenario.estimatedTime}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-6 py-4 border-t border-gray-200">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectScenario(scenario.id);
                  }}
                  className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>View Briefing</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredScenarios.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-gray-600">No scenarios match your filters</p>
            <button
              onClick={() => {
                setSelectedSkill(null);
                setSelectedDifficulty(null);
              }}
              className="mt-4 px-6 py-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

