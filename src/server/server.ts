import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { audioRouter } from './audioRouter.js';
import { ScenarioEngine } from '../engine/engine.js';
import { performanceReviewScenario } from '../engine/scenarios/index.js';
import { createLLMProvider } from '../llm/index.js';
import { getVoiceGenerator, VoiceProfile } from '../audio/voiceGenerator.js';

const app = express();
const server = createServer(app);

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Health check route
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get available scenarios
app.get('/api/scenarios', (_req, res) => {
  res.json({
    scenarios: [
      {
        id: performanceReviewScenario.id,
        name: performanceReviewScenario.name,
        description: performanceReviewScenario.description,
        difficulty: performanceReviewScenario.difficulty,
        employeeName: performanceReviewScenario.defaultContext.employeeName || 'Alex'
      }
    ]
  });
});

// Audio router
app.use('/api/audio', audioRouter);

// WebSocket server
const wss = new WebSocketServer({ server });

// Store active engines per connection
const activeEngines = new Map<WebSocket, ScenarioEngine>();

wss.on('connection', (ws) => {
  logger.info('WebSocket client connected');

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      logger.debug('Received message:', { type: message.type });

      switch (message.type) {
        case 'start_scenario': {
          // Create LLM provider
          const llm = createLLMProvider(config.llmProvider as 'gemini' | 'claude' | 'ollama');

          // Create scenario engine
          const engine = new ScenarioEngine(llm);
          await engine.initialize(performanceReviewScenario, message.context);

          // Store engine for this connection
          activeEngines.set(ws, engine);

          const state = engine.getState();

          ws.send(JSON.stringify({
            type: 'scenario_started',
            scenario: {
              id: state?.scenario.id,
              name: state?.scenario.name,
              employeeName: state?.context.employeeName,
              description: state?.scenario.description
            }
          }));

          logger.info('Scenario started');
          break;
        }

        case 'send_message': {
          const engine = activeEngines.get(ws);
          if (!engine) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'No active scenario. Please start a scenario first.'
            }));
            return;
          }

          const { content } = message;

          // Process the manager's input
          const result = await engine.processInput(content);

          // Generate audio for employee response
          const voiceGen = getVoiceGenerator();
          let audioBase64: string | null = null;

          if (voiceGen.isEnabled()) {
            try {
              audioBase64 = await voiceGen.generateSpeech(
                result.employeeResponse,
                VoiceProfile.EMPLOYEE
              );
            } catch (error) {
              logger.error('Failed to generate audio, continuing without it:', error);
            }
          }

          // Send response back to client
          ws.send(JSON.stringify({
            type: 'message_response',
            employeeResponse: result.employeeResponse,
            shadowFeed: result.shadowFeed,
            metrics: result.metrics,
            audio: audioBase64 // Base64-encoded MP3
          }));

          logger.debug('Message processed', {
            turnCount: engine.getState()?.turnCount,
            hasAudio: !!audioBase64
          });
          break;
        }

        case 'end_scenario': {
          const engine = activeEngines.get(ws);
          if (!engine) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'No active scenario to end.'
            }));
            return;
          }

          const report = await engine.endScenario();

          ws.send(JSON.stringify({
            type: 'scenario_ended',
            report
          }));

          // Clean up
          activeEngines.delete(ws);
          logger.info('Scenario ended');
          break;
        }

        default:
          logger.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      logger.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  });

  ws.on('close', () => {
    logger.info('WebSocket client disconnected');
    activeEngines.delete(ws);
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
  });
});

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
  logger.info(`WebSocket available at ws://localhost:${PORT}`);
});
