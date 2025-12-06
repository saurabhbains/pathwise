import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import CoachDashboard from './components/CoachDashboard';
import StatsModal from './components/StatsModal';
import ScenarioEndModal from './components/ScenarioEndModal';
import CoachHome from './components/CoachHome';
import ScenarioConfigurator from './components/ScenarioConfigurator';
import ScenarioSelector from './components/ScenarioSelector';
import ScenarioBriefing from './components/ScenarioBriefing';
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

        {/* COACH FLOW - Setup & Configuration */}
        <Route path="/coach" element={<CoachHome />} />
        <Route path="/coach/scenario/:id/configure" element={<ScenarioConfigurator />} />
        <Route path="/coach/scenario/:id/test" element={<SimulationView />} />
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
        const response = await fetch(`http://localhost:3000/api/scenarios/${id}`);
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
    legalRisk: 0,
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
        const response = await fetch(`http://localhost:3000/api/scenarios/${id}`);
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
      legalRisk: 0,
      clarityOfFeedback: 100,
    });
    setIsLoading(false);
    setScenarioStarted(false);
    wsResetScenario();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header with Navigation */}
      <header className="bg-[#3D5A80] shadow-sm border-b border-[#293241]">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <img
                  src="/pathwiseicon_square.png"
                  alt="Pathwise"
                  className="w-10 h-10 rounded-lg"
                />
                <img
                  src="/pathwise_wordmark_white.png"
                  alt="Pathwise - AI-Powered Coaching Simulation"
                  className="h-8"
                />
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Mode Switcher */}
              <div className="flex items-center space-x-2 bg-[#293241] rounded-lg p-1">
                <Link
                  to="/"
                  className="px-4 py-2 text-sm font-medium rounded-md transition-colors text-[#E0FBFC] hover:bg-[#3D5A80]"
                >
                  🎓 Learner
                </Link>
                <Link
                  to="/coach"
                  className="px-4 py-2 text-sm font-medium rounded-md transition-colors text-[#E0FBFC] hover:bg-[#3D5A80]"
                >
                  👨‍🏫 Coach
                </Link>
              </div>

              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-sm text-[#E0FBFC]">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
          {error && (
            <div className="mt-2 text-sm text-red-200 bg-red-900 bg-opacity-50 px-3 py-2 rounded">
              {error}
            </div>
          )}
        </div>
      </header>

      {/* Main Split Screen Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat Interface */}
        <div className="w-1/2 border-r border-gray-300">
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

        {/* Right: Coach Dashboard */}
        <div className="w-1/2">
          <CoachDashboard
            shadowThoughts={shadowThoughts}
            metrics={metrics}
          />
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
