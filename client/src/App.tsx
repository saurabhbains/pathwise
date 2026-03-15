import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { config } from './config';
import ChatInterface from './components/ChatInterface';
import CoachDashboard from './components/CoachDashboard';
import StatsModal from './components/StatsModal';
import ScenarioEndModal from './components/ScenarioEndModal';
import CoachHome from './components/CoachHome';
import ClientScenarios from './components/ClientScenarios';
import ScenarioConfigurator from './components/ScenarioConfigurator';
import ScenarioSelector from './components/ScenarioSelector';
import ScenarioBriefing from './components/ScenarioBriefing';
import PracticeHistory from './components/PracticeHistory';
import ScenarioAnalytics from './components/ScenarioAnalytics';
import { useWebSocket } from './hooks/useWebSocket';
import type { Message, ShadowThought, Metrics } from './types';

// Helper function to convert base64 to Blob
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LEARNER FLOW - Main User Experience */}
        <Route path="/" element={<ScenarioSelector onSelectScenario={(id) => window.location.href = `/scenario/${id}`} />} />
        <Route path="/scenario/:id" element={<ScenarioBriefingWrapper />} />
        <Route path="/simulation/:scenarioId" element={<SimulationView />} />
        <Route path="/simulation" element={<SimulationView />} /> {/* Fallback for default scenario */}
        <Route path="/history" element={<PracticeHistory />} />

        {/* COACH FLOW - Setup & Configuration */}
        <Route path="/coach" element={<CoachHome />} />
        <Route path="/coach/client/:clientId" element={<ClientScenarios />} />
        <Route path="/coach/scenario/:id/configure" element={<ScenarioConfigurator />} />
        <Route path="/coach/scenario/:id/test" element={<SimulationView />} />
        <Route path="/coach/scenario/:id/analytics" element={<ScenarioAnalytics />} />
      </Routes>
    </BrowserRouter>
  );
}

// Wrapper component for scenario briefing that handles the flow
function ScenarioBriefingWrapper() {
  const { id } = useParams();
  const [scenarioData, setScenarioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/api/scenarios/${id}`);
        const data = await response.json();
        setScenarioData(data);
      } catch (error) {
        console.error('Failed to fetch scenario:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScenario();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E0FBFC] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-[#98C1D9] border-t-[#EE6C4D] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl font-bold text-[#3D5A80]">Loading scenario...</p>
        </div>
      </div>
    );
  }

  if (!scenarioData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E0FBFC] to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#293241]">Scenario not found</p>
          <Link to="/" className="mt-4 inline-block px-6 py-3 bg-[#EE6C4D] text-white rounded-xl font-bold">
            Back to Scenarios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ScenarioBriefing
      scenarioName={scenarioData.name}
      description={scenarioData.description}
      difficulty={scenarioData.difficulty}
      skillTags={scenarioData.skillTags || []}
      orgContext={scenarioData.orgContext}
      characterBio={scenarioData.characterBio}
      situationBrief={scenarioData.situationBrief}
      hiddenGoals={scenarioData.hiddenGoals}
      objectives={scenarioData.objectives || []}
      onStartScenario={() => window.location.href = `/simulation/${id}`}
      onBack={() => window.location.href = '/'}
    />
  );
}

// Simulation View Component (the original app content)
function SimulationView() {
  const { scenarioId } = useParams<{ scenarioId?: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [shadowThoughts, setShadowThoughts] = useState<ShadowThought[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    psychologicalSafety: 100,
    legalCompliance: 100,
    clarityOfFeedback: 100,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [scenarioStarted, setScenarioStarted] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [scenarioInfo, setScenarioInfo] = useState({
    characterName: 'Alex',
    characterRole: 'Employee',
    scenarioName: 'Performance Review'
  });

  const {
    isConnected,
    startScenario,
    sendMessage: wsSendMessage,
    endScenario: wsEndScenario,
    resetScenario: wsResetScenario,
    lastEmployeeResponse,
    lastShadowFeed,
    lastMetrics,
    lastAudio,
    scenarioEnded,
    scenarioReport,
    error
  } = useWebSocket(scenarioId);

  // Fetch scenario info on mount
  useEffect(() => {
    const fetchScenarioInfo = async () => {
      try {
        const id = scenarioId || 'def-dev-001'; // Default to defensive developer
        const response = await fetch(`${config.apiUrl}/api/scenarios/${id}`);
        const data = await response.json();

        if (data.characterBio) {
          setScenarioInfo({
            characterName: data.characterBio.name || 'Alex',
            characterRole: data.characterBio.role || 'Employee',
            scenarioName: data.name || 'Performance Review'
          });
        }
      } catch (error) {
        console.error('Failed to fetch scenario info:', error);
        // Keep defaults
      }
    };

    fetchScenarioInfo();
  }, [scenarioId]);

  // Handle employee response
  useEffect(() => {
    if (lastEmployeeResponse) {
      const employeeMessage: Message = {
        id: Date.now().toString(),
        role: 'employee',
        content: lastEmployeeResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, employeeMessage]);
      setIsLoading(false);
    }
  }, [lastEmployeeResponse]);

  // Handle shadow feed updates
  useEffect(() => {
    if (lastShadowFeed && lastShadowFeed.length > 0) {
      setShadowThoughts(prev => [...prev, ...lastShadowFeed]);
    }
  }, [lastShadowFeed]);

  // Handle metrics updates
  useEffect(() => {
    if (lastMetrics) {
      setMetrics(lastMetrics);
    }
  }, [lastMetrics]);

  // Handle audio playback
  useEffect(() => {
    if (lastAudio) {
      // Convert base64 to audio and play
      const audioBlob = base64ToBlob(lastAudio, 'audio/mpeg');
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.play().catch(err => {
        console.error('Error playing audio:', err);
      });

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    }
  }, [lastAudio]);

  const handleSendMessage = async (content: string) => {
    if (!isConnected) {
      console.error('Not connected to server');
      return;
    }

    setIsLoading(true);

    const managerMessage: Message = {
      id: Date.now().toString(),
      role: 'manager',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, managerMessage]);

    wsSendMessage(content);
  };

  const handleEndScenario = () => {
    if (confirm('Are you sure you want to end this scenario?')) {
      wsEndScenario();
    }
  };

  const handleViewStats = () => {
    setShowStatsModal(true);
  };

  const handleStartNew = () => {
    setMessages([]);
    setShadowThoughts([]);
    setMetrics({
      psychologicalSafety: 100,
      legalCompliance: 100,
      clarityOfFeedback: 100,
    });
    setIsLoading(false);
    setScenarioStarted(false);
    wsResetScenario();
  };

  const getMetricColor = (value: number) => {
    if (value >= 70) return { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (value >= 50) return { bar: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50' };
    return { bar: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-50' };
  };

  const metricLabels = [
    { key: 'psychologicalSafety', label: 'Psychological Safety', icon: '🧠', description: 'How safe the employee feels' },
    { key: 'legalCompliance', label: 'Legal Compliance', icon: '⚖️', description: 'Professional & legal standards' },
    { key: 'clarityOfFeedback', label: 'Clarity of Feedback', icon: '🎯', description: 'Specificity & actionability' },
  ] as const;

  return (
    <div className="h-screen flex flex-col bg-[#F8F7F4]">
      {/* Header */}
      <header className="bg-[#1E2D3D] shadow-sm border-b border-[#2E4057]">
        <div className="max-w-full mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img src="/pathwiseicon_square.png" alt="Pathwise" className="w-9 h-9 rounded-lg" />
              <img src="/pathwise_wordmark_white.png" alt="Pathwise" className="h-7" />
            </Link>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 bg-[#2E4057] rounded-lg p-1">
                <Link to="/" className="px-3 py-1.5 bg-[#6366F1] text-white text-sm font-medium rounded-md">
                  Learner
                </Link>
                <Link to="/coach" className="px-3 py-1.5 text-slate-300 hover:text-white text-sm font-medium rounded-md transition-colors">
                  Coach
                </Link>
              </div>

              <div className="flex items-center space-x-1.5">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className="text-xs text-slate-400">{isConnected ? 'Live' : 'Offline'}</span>
              </div>

              <Link to="/history" className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg text-sm font-medium transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>History</span>
              </Link>
            </div>
          </div>
          {error && (
            <div className="mt-2 text-xs text-red-300 bg-red-900/40 px-3 py-1.5 rounded">{error}</div>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat — takes most of the space */}
        <div className="flex-1 border-r border-[#E8E4DE]">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onEndScenario={handleEndScenario}
            onViewStats={handleViewStats}
            isLoading={isLoading}
            characterName={scenarioInfo.characterName}
            characterRole={scenarioInfo.characterRole}
            scenarioName={scenarioInfo.scenarioName}
          />
        </div>

        {/* Right: Learner Metrics Panel */}
        <div className="w-72 bg-white flex flex-col overflow-y-auto border-l border-[#E8E4DE]">
          {/* Panel Header */}
          <div className="px-5 py-4 border-b border-[#E8E4DE]">
            <h3 className="text-sm font-semibold text-[#1E2D3D]">Your Performance</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live scores updated in real time</p>
          </div>

          {/* Metric Cards */}
          <div className="px-4 py-4 space-y-3">
            {metricLabels.map(({ key, label, icon, description }) => {
              const value = metrics[key];
              const colors = getMetricColor(value);
              return (
                <div key={key} className={`rounded-xl p-4 ${colors.bg} border border-opacity-20`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{icon}</span>
                      <span className="text-xs font-semibold text-[#1E2D3D]">{label}</span>
                    </div>
                    <span className={`text-sm font-bold ${colors.text}`}>{value}</span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-700 ${colors.bar}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">{description}</p>
                </div>
              );
            })}
          </div>

          {/* Tips Section */}
          <div className="px-4 pb-4 mt-2">
            <div className="bg-[#EEF2FF] rounded-xl p-4 border border-indigo-100">
              <p className="text-xs font-semibold text-[#4F46E5] mb-1">💡 Coaching Tip</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keep scores above 70 by using specific examples, avoiding blame, and checking in on how your employee is feeling.
              </p>
            </div>
          </div>

          {/* Message count */}
          <div className="mt-auto px-4 pb-4">
            <div className="bg-[#F8F7F4] rounded-xl p-3 border border-[#E8E4DE] text-center">
              <p className="text-2xl font-bold text-[#1E2D3D]">{messages.filter(m => m.role === 'manager').length}</p>
              <p className="text-xs text-slate-400 mt-0.5">messages sent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        metrics={metrics}
        messageCount={messages.filter(m => m.role === 'manager').length}
      />

      <ScenarioEndModal
        isOpen={scenarioEnded}
        onStartNew={handleStartNew}
        report={scenarioReport}
        metrics={metrics}
        messageCount={messages.filter(m => m.role === 'manager').length}
      />
    </div>
  );
}

export default App;
