import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import CoachDashboard from './components/CoachDashboard';
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [shadowThoughts, setShadowThoughts] = useState<ShadowThought[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    psychologicalSafety: 100,
    legalRisk: 0,
    clarityOfFeedback: 100,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [scenarioStarted, setScenarioStarted] = useState(false);

  const {
    isConnected,
    startScenario,
    sendMessage: wsSendMessage,
    lastEmployeeResponse,
    lastShadowFeed,
    lastMetrics,
    lastAudio,
    error
  } = useWebSocket();

  // Auto-start scenario when WebSocket connects
  useEffect(() => {
    console.log('Auto-start check:', { isConnected, scenarioStarted });
    if (isConnected && !scenarioStarted) {
      console.log('Starting scenario...');
      startScenario();
      setScenarioStarted(true);
    }
  }, [isConnected, scenarioStarted, startScenario]);

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
        // Browser might block autoplay - user will still see text
      });

      // Cleanup
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

    // Add manager's message
    const managerMessage: Message = {
      id: Date.now().toString(),
      role: 'manager',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, managerMessage]);

    // Send via WebSocket
    wsSendMessage(content);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pathwise</h1>
              <p className="text-sm text-gray-600">AI-Powered Coaching Simulation</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
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
            isLoading={isLoading}
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
    </div>
  );
}

export default App;
