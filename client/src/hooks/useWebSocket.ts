import { useEffect, useRef, useState, useCallback } from 'react';
import type { ShadowThought, Metrics, ScenarioReport } from '../types';
import { config } from '../config';

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  startScenario: (scenarioId?: string) => void;
  sendMessage: (content: string) => void;
  endScenario: () => void;
  resetScenario: () => void;
  lastEmployeeResponse: string | null;
  lastShadowFeed: ShadowThought[];
  lastMetrics: Metrics | null;
  lastAudio: string | null;
  scenarioEnded: boolean;
  scenarioReport: ScenarioReport | null;
  error: string | null;
}

const WS_URL = config.wsUrl;

export function useWebSocket(scenarioId?: string): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEmployeeResponse, setLastEmployeeResponse] = useState<string | null>(null);
  const [lastShadowFeed, setLastShadowFeed] = useState<ShadowThought[]>([]);
  const [lastMetrics, setLastMetrics] = useState<Metrics | null>(null);
  const [lastAudio, setLastAudio] = useState<string | null>(null);
  const [scenarioEnded, setScenarioEnded] = useState(false);
  const [scenarioReport, setScenarioReport] = useState<ScenarioReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setError(null);

      // Auto-start scenario immediately when connected
      console.log('Auto-starting scenario...', scenarioId);
      ws.send(JSON.stringify({
        type: 'start_scenario',
        scenarioId: scenarioId || 'perf-review-001', // Default to original scenario
        context: {}
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log('Received:', message.type);

        switch (message.type) {
          case 'scenario_started':
            console.log('Scenario started:', message.scenario);
            setError(null);
            break;

          case 'message_response':
            setLastEmployeeResponse(message.employeeResponse);
            setLastShadowFeed(message.shadowFeed);
            setLastMetrics(message.metrics);
            setLastAudio(message.audio || null);
            setError(null);
            break;

          case 'scenario_ended':
            console.log('Scenario ended:', message.report);
            setScenarioEnded(true);
            setScenarioReport(message.report);
            setError(null);
            break;

          case 'error':
            console.error('Server error:', message.message);
            setError(message.message);
            break;
        }
      } catch (err) {
        console.error('Error parsing message:', err);
        setError('Failed to parse server message');
      }
    };

    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('WebSocket connection error');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [scenarioId]); // Re-connect if scenarioId changes

  const startScenario = useCallback((customScenarioId?: string) => {
    console.log('startScenario called, WebSocket state:', wsRef.current?.readyState);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('Sending start_scenario message');
      wsRef.current.send(JSON.stringify({
        type: 'start_scenario',
        scenarioId: customScenarioId || scenarioId || 'perf-review-001',
        context: {} // Use default scenario context
      }));
    } else {
      console.error('WebSocket not open, state:', wsRef.current?.readyState);
      setError('WebSocket not connected');
    }
  }, [scenarioId]);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'send_message',
        content
      }));
    } else {
      setError('WebSocket not connected');
    }
  }, []);

  const endScenario = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'end_scenario'
      }));
    } else {
      setError('WebSocket not connected');
    }
  }, []);

  const resetScenario = useCallback(() => {
    // Reset all state
    setLastEmployeeResponse(null);
    setLastShadowFeed([]);
    setLastMetrics(null);
    setLastAudio(null);
    setScenarioEnded(false);
    setScenarioReport(null);
    setError(null);

    // Start a new scenario
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('Resetting and starting new scenario...');
      wsRef.current.send(JSON.stringify({
        type: 'start_scenario',
        scenarioId: scenarioId || 'perf-review-001',
        context: {}
      }));
    }
  }, [scenarioId]);

  return {
    isConnected,
    startScenario,
    sendMessage,
    endScenario,
    resetScenario,
    lastEmployeeResponse,
    lastShadowFeed,
    lastMetrics,
    lastAudio,
    scenarioEnded,
    scenarioReport,
    error
  };
}
