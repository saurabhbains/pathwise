import { useState, useEffect } from 'react';

interface ScenarioCard {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  skillTags: string[];
  characterName: string;
  characterRole: string;
  personaType: string;
  estimatedTime: string;
  timesRun: number;
  avgScore: number;
}

export default function CoachHome() {
  const [scenarios, setScenarios] = useState<ScenarioCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'all' | 'library' | 'custom'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/scenarios/library');
      const data = await response.json();
      setScenarios(data.scenarios.map((s: any) => ({
        ...s,
        personaType: s.personaType || 'defensive',
        timesRun: Math.floor(Math.random() * 50),
        avgScore: Math.floor(Math.random() * 40) + 50
      })));
    } catch (error) {
      console.error('Failed to fetch scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredScenarios = scenarios.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'novice': return 'bg-green-100 text-green-700 border-green-300';
      case 'intermediate': return 'bg-[#E0FBFC] text-[#3D5A80] border-[#98C1D9]';
      case 'advanced': return 'bg-[#EE6C4D] bg-opacity-20 text-[#EE6C4D] border-[#EE6C4D]';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'novice': return '🌱';
      case 'intermediate': return '🔥';
      case 'advanced': return '💎';
      default: return '⭐';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0FBFC] via-white to-[#98C1D9] relative overflow-hidden">
      {/* Playful Background Decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EE6C4D] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3D5A80] rounded-full opacity-5 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      {/* Header */}
      <div className="relative bg-[#3D5A80] border-b-2 border-[#293241] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img 
                src="/pathwiseicon_square.png" 
                alt="Pathwise" 
                className="w-16 h-16 rounded-2xl shadow-lg"
              />
              <div>
                <img 
                  src="/pathwise_wordmark_white.png" 
                  alt="Pathwise" 
                  className="h-10 mb-2"
                />
                <p className="text-[#E0FBFC] font-medium">Design the perfect leadership challenge ✨</p>
              </div>
            </div>
            
            {/* Mode Switcher + Create Button */}
            <div className="flex items-center space-x-3">
              {/* History Button */}
              <button
                onClick={() => window.location.href = '/history'}
                className="flex items-center space-x-2 px-4 py-2 bg-[#EE6C4D] hover:bg-[#D85A3A] text-white rounded-lg font-medium transition-colors shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <span>Practice History</span>
              </button>

              <div className="flex items-center space-x-2 bg-[#293241] rounded-xl p-1 border-2 border-[#98C1D9]">
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 text-[#E0FBFC] hover:bg-[#3D5A80] rounded-lg font-bold transition-colors"
                >
                  🎓 Learner
                </button>
                <button
                  className="px-4 py-2 bg-[#98C1D9] text-[#293241] rounded-lg font-bold shadow-md"
                >
                  👨‍🏫 Coach
                </button>
              </div>

              <button
                onClick={() => window.location.href = '/coach/create'}
                className="group px-8 py-4 bg-gradient-to-r from-[#EE6C4D] to-[#ff8a73] hover:from-[#ff8a73] hover:to-[#EE6C4D] text-white rounded-2xl font-bold transition-all transform hover:scale-105 hover:-rotate-1 shadow-xl hover:shadow-2xl flex items-center space-x-3"
              >
                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-lg">Create Scenario</span>
              </button>
            </div>
          </div>

          {/* Fun Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Scenarios', value: scenarios.length, emoji: '📚', color: 'from-[#3D5A80] to-[#98C1D9]' },
              { label: 'Total Runs', value: scenarios.reduce((sum, s) => sum + s.timesRun, 0), emoji: '⚡', color: 'from-[#98C1D9] to-[#E0FBFC]' },
              { label: 'Avg Score', value: `${Math.round(scenarios.reduce((sum, s) => sum + s.avgScore, 0) / scenarios.length || 0)}%`, emoji: '🎯', color: 'from-[#EE6C4D] to-[#ff8a73]' },
              { label: 'Active Learners', value: '12', emoji: '👥', color: 'from-[#98C1D9] to-[#3D5A80]' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 border-2 border-transparent hover:border-[#98C1D9] cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#3D5A80] uppercase tracking-wide">{stat.label}</p>
                    <p className="text-3xl font-black text-[#293241] mt-1">{stat.value}</p>
                  </div>
                  <div className="text-5xl transform group-hover:scale-125 group-hover:rotate-12 transition-transform">
                    {stat.emoji}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search scenarios... 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 text-lg border-3 border-[#98C1D9] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#98C1D9] focus:ring-opacity-30 focus:border-[#3D5A80] transition-all shadow-lg bg-white"
            />
            <svg className="w-6 h-6 text-[#3D5A80] absolute left-5 top-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block relative">
              <div className="w-20 h-20 border-8 border-[#98C1D9] border-t-[#EE6C4D] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
                🎯
              </div>
            </div>
            <p className="mt-6 text-xl font-bold text-[#3D5A80]">Loading your scenarios...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredScenarios.map((scenario, idx) => (
              <div
                key={scenario.id}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-3 border-[#E0FBFC] hover:border-[#98C1D9] overflow-hidden transform hover:-translate-y-2"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left: Character Avatar & Info */}
                  <div className="md:w-1/4 bg-gradient-to-br from-[#3D5A80] to-[#98C1D9] p-8 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    </div>
                    
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#EE6C4D] to-[#ff8a73] rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all ring-4 ring-white">
                      {scenario.characterName.charAt(0)}
                    </div>
                    
                    <h3 className="mt-4 text-xl font-black text-white text-center">{scenario.characterName}</h3>
                    <p className="text-sm text-[#E0FBFC] text-center">{scenario.characterRole}</p>
                    
                    <div className="mt-4 flex items-center space-x-2">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${getDifficultyColor(scenario.difficulty)} flex items-center space-x-1 shadow-lg`}>
                        <span>{getDifficultyEmoji(scenario.difficulty)}</span>
                        <span>{scenario.difficulty.toUpperCase()}</span>
                      </span>
                    </div>
                  </div>

                  {/* Middle: Scenario Details */}
                  <div className="flex-1 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-[#293241] mb-2 group-hover:text-[#3D5A80] transition-colors">
                          {scenario.name}
                        </h3>
                        <p className="text-[#3D5A80] leading-relaxed">{scenario.description}</p>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {scenario.skillTags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gradient-to-r from-[#E0FBFC] to-[#98C1D9] text-[#3D5A80] rounded-full text-xs font-bold border-2 border-[#98C1D9] hover:scale-105 transition-transform cursor-pointer"
                        >
                          {tag.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">📊</span>
                        <span className="text-[#3D5A80] font-semibold">{scenario.timesRun} runs</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🎯</span>
                        <span className="text-[#3D5A80] font-semibold">{scenario.avgScore}% avg</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">⏱️</span>
                        <span className="text-[#3D5A80] font-semibold">{scenario.estimatedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="md:w-64 bg-gradient-to-br from-[#E0FBFC] to-white p-6 border-l-2 border-[#98C1D9] flex flex-col space-y-3">
                    <button
                      onClick={() => window.location.href = `/coach/scenario/${scenario.id}/configure`}
                      className="w-full py-3 px-4 bg-white hover:bg-[#E0FBFC] text-[#3D5A80] border-2 border-[#3D5A80] rounded-xl font-bold transition-all transform hover:scale-105 hover:-rotate-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Configure</span>
                    </button>

                    <button
                      onClick={() => window.location.href = `/coach/scenario/${scenario.id}/test`}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#EE6C4D] to-[#ff8a73] hover:from-[#ff8a73] hover:to-[#EE6C4D] text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Test Run</span>
                    </button>

                    <button
                      onClick={() => window.location.href = `/coach/scenario/${scenario.id}/analytics`}
                      className="w-full py-3 px-4 bg-white hover:bg-[#98C1D9] text-[#3D5A80] hover:text-white border-2 border-[#98C1D9] rounded-xl font-bold transition-all transform hover:scale-105 hover:rotate-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Analytics</span>
                    </button>

                    <div className="pt-3 mt-3 border-t-2 border-[#98C1D9]">
                      <p className="text-xs font-bold text-[#3D5A80] mb-2 uppercase tracking-wide">Quick Actions</p>
                      <div className="space-y-1">
                        <button className="w-full text-xs py-2 text-[#3D5A80] hover:text-[#EE6C4D] hover:bg-white rounded-lg transition-all text-left px-2 font-semibold">
                          📋 Duplicate
                        </button>
                        <button className="w-full text-xs py-2 text-[#3D5A80] hover:text-[#EE6C4D] hover:bg-white rounded-lg transition-all text-left px-2 font-semibold">
                          📤 Export
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredScenarios.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-8xl mb-4 animate-bounce">🤔</div>
            <p className="text-2xl font-black text-[#293241] mb-2">No scenarios found</p>
            <p className="text-[#3D5A80]">Try adjusting your search or create a new one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

