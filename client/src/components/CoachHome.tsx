import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
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
        timesRun: Math.floor(Math.random() * 50), // Mock data
        avgScore: Math.floor(Math.random() * 40) + 50 // Mock data
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
      case 'novice': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPersonaColor = (persona: string) => {
    switch (persona) {
      case 'defensive': return 'bg-orange-100 text-orange-800';
      case 'checked_out': return 'bg-blue-100 text-blue-800';
      case 'high_performer': return 'bg-purple-100 text-purple-800';
      case 'hostile': return 'bg-red-100 text-red-800';
      case 'overwhelmed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Coach Dashboard</h1>
              <p className="text-gray-600">Configure, test, and manage your simulation scenarios</p>
            </div>
            <button
              onClick={() => navigate('/coach/create')}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-medium transition-all flex items-center space-x-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Custom Scenario</span>
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Total Scenarios</p>
                  <p className="text-2xl font-bold text-blue-900">{scenarios.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Total Runs</p>
                  <p className="text-2xl font-bold text-green-900">
                    {scenarios.reduce((sum, s) => sum + s.timesRun, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Avg Performance</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {Math.round(scenarios.reduce((sum, s) => sum + s.avgScore, 0) / scenarios.length || 0)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium">Active Learners</p>
                  <p className="text-2xl font-bold text-orange-900">12</p>
                </div>
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search scenarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('all')}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  view === 'all' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Scenarios
              </button>
              <button
                onClick={() => setView('library')}
                className={`px-4 py-3 text-sm font-medium transition-colors border-l border-gray-300 ${
                  view === 'library' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Library
              </button>
              <button
                onClick={() => setView('custom')}
                className={`px-4 py-3 text-sm font-medium transition-colors border-l border-gray-300 ${
                  view === 'custom' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Custom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading scenarios...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary-400 overflow-hidden"
              >
                <div className="flex">
                  {/* Left: Scenario Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{scenario.name}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{scenario.description}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getDifficultyColor(scenario.difficulty)}`}>
                            {scenario.difficulty.toUpperCase()}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getPersonaColor(scenario.personaType)}`}>
                            {scenario.personaType.replace(/_/g, ' ')}
                          </span>
                          {scenario.skillTags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                              {tag.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Character Preview */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                        {scenario.characterName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{scenario.characterName}</p>
                        <p className="text-xs text-gray-600">{scenario.characterRole}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Runs: {scenario.timesRun}</p>
                        <p className="text-xs text-gray-500">Avg: {scenario.avgScore}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="w-64 bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-200 p-6 flex flex-col justify-between">
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate(`/coach/scenario/${scenario.id}/configure`)}
                        className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Configure</span>
                      </button>

                      <button
                        onClick={() => navigate(`/coach/scenario/${scenario.id}/test`)}
                        className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Test Run</span>
                      </button>

                      <button
                        onClick={() => navigate(`/coach/scenario/${scenario.id}/analytics`)}
                        className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Analytics</span>
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <p className="text-xs text-gray-500 mb-2">Quick Actions</p>
                      <div className="space-y-2">
                        <button className="w-full text-xs py-2 text-gray-700 hover:text-primary-600 transition-colors text-left">
                          📋 Duplicate
                        </button>
                        <button className="w-full text-xs py-2 text-gray-700 hover:text-primary-600 transition-colors text-left">
                          📤 Export
                        </button>
                        <button className="w-full text-xs py-2 text-gray-700 hover:text-red-600 transition-colors text-left">
                          🗑️ Archive
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
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-gray-600 mb-2">No scenarios found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or create a new scenario</p>
          </div>
        )}
      </div>
    </div>
  );
}

