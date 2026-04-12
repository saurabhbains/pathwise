import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import multer from 'multer';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { audioRouter } from './audioRouter.js';
import { ScenarioEngine } from '../engine/engine.js';
import { performanceReviewScenario, getAllScenarios, getScenarioById } from '../engine/scenarios/index.js';
import { createLLMProvider } from '../llm/index.js';
import { getVoiceGenerator, VoiceProfile } from '../audio/voiceGenerator.js';
import { generatePDFReport } from '../reports/pdfReport.js';
import type { ScenarioReport } from '../engine/scenarioTypes.js';

const app = express();
const server = createServer(app);

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://pathwise-ashy.vercel.app',
];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app'))) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
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

// Get all scenarios from library
app.get('/api/scenarios/library', (_req, res) => {
  const scenarios = getAllScenarios();
  res.json({
    scenarios: scenarios.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      difficulty: s.difficulty,
      skillTags: s.skillTags || [],
      characterName: s.characterBio?.name || s.defaultContext.employeeName || 'Employee',
      characterRole: s.characterBio?.role || s.defaultContext.employeeRole || 'Team Member',
      estimatedTime: getEstimatedTime(s.successCriteria?.minTurns || 5)
    }))
  });
});

// Get specific scenario details (for briefing)
app.get('/api/scenarios/:id', (req, res) => {
  const scenario = getScenarioById(req.params.id);
  if (!scenario) {
    res.status(404).json({ error: 'Scenario not found' });
    return;
  }

  res.json({
    id: scenario.id,
    name: scenario.name,
    description: scenario.description,
    difficulty: scenario.difficulty,
    skillTags: scenario.skillTags || [],
    orgContext: scenario.orgContext,
    characterBio: scenario.characterBio,
    situationBrief: scenario.situationBrief,
    hiddenGoals: scenario.hiddenGoals,
    objectives: scenario.objectives,
    successCriteria: scenario.successCriteria,
    coachingFramework: scenario.coachingFramework
  });
});

function getEstimatedTime(minTurns: number): string {
  const minutes = minTurns * 3; // Rough estimate: 3 min per turn
  const low = minutes;
  const high = minutes + 10;
  return `${low}-${high} min`;
}

// Audio router
app.use('/api/audio', audioRouter);

// ── PDF Report Generation ─────────────────────────────────────────────────────
app.post('/api/report/pdf', async (req, res) => {
  try {
    const report: ScenarioReport = req.body;
    if (!report || !report.scenarioId) {
      res.status(400).json({ error: 'Invalid report data' });
      return;
    }
    const pdfBuffer = await generatePDFReport(report);
    const filename = `pathwise-report-${report.scenarioId}-${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    logger.error('PDF generation failed:', error);
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
});

// ── RAG Document Upload ───────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  }
});

// In-memory store for uploaded documents (keyed by session/scenario)
const uploadedDocuments = new Map<string, { name: string; content: string; uploadedAt: Date }[]>();

app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const sessionId = req.body.sessionId || 'default';
    let content = '';

    if (req.file.mimetype === 'text/plain') {
      content = req.file.buffer.toString('utf-8');
    } else if (req.file.mimetype === 'application/pdf') {
      // Extract text from PDF using basic buffer parsing
      const text = req.file.buffer.toString('binary');
      // Extract readable text between BT/ET markers (basic PDF text extraction)
      const matches = text.match(/BT[\s\S]*?ET/g) || [];
      const extracted = matches.map(block => {
        return block.replace(/BT|ET|Tf|Td|TD|Tm|T\*|Tj|TJ|'|"/g, ' ')
          .replace(/\(([^)]*)\)/g, '$1')
          .replace(/[^\x20-\x7E\s]/g, ' ')
          .trim();
      }).join(' ');
      content = extracted || req.file.buffer.toString('utf-8', 0, 10000);
    }

    if (!uploadedDocuments.has(sessionId)) {
      uploadedDocuments.set(sessionId, []);
    }
    uploadedDocuments.get(sessionId)!.push({
      name: req.file.originalname,
      content: content.slice(0, 50000), // cap at 50k chars
      uploadedAt: new Date()
    });

    logger.info('Document uploaded', { sessionId, filename: req.file.originalname, size: req.file.size });
    res.json({ success: true, filename: req.file.originalname, sessionId });
  } catch (error) {
    logger.error('Document upload failed:', error);
    res.status(500).json({ error: 'Failed to process document' });
  }
});

app.get('/api/documents/:sessionId', (req, res) => {
  const docs = uploadedDocuments.get(req.params.sessionId) || [];
  res.json({ documents: docs.map(d => ({ name: d.name, uploadedAt: d.uploadedAt })) });
});

app.delete('/api/documents/:sessionId/:filename', (req, res) => {
  const docs = uploadedDocuments.get(req.params.sessionId) || [];
  const filtered = docs.filter(d => d.name !== req.params.filename);
  uploadedDocuments.set(req.params.sessionId, filtered);
  res.json({ success: true });
});

// Expose uploaded doc context for WebSocket scenario start
export function getDocumentContext(sessionId: string): string {
  const docs = uploadedDocuments.get(sessionId) || [];
  if (docs.length === 0) return '';
  return docs.map(d => `=== ${d.name} ===\n${d.content}`).join('\n\n');
}

// ── Session Store (in-memory, powers Coach dashboard) ────────────────────────
interface CompletedSession {
  id: string;
  scenarioId: string;
  scenarioName: string;
  completedAt: Date;
  report: ScenarioReport;
}
const completedSessions: CompletedSession[] = [];

app.get('/api/sessions', (_req, res) => {
  res.json({ sessions: completedSessions.slice().reverse() }); // newest first
});

app.get('/api/sessions/stats', (_req, res) => {
  const total = completedSessions.length;
  if (total === 0) {
    res.json({ totalSessions: 0, avgPsychSafety: 0, avgLegal: 0, avgClarity: 0, avgOverall: 0 });
    return;
  }
  const avg = (key: keyof ScenarioReport['finalMetrics']) =>
    Math.round(completedSessions.reduce((sum, s) => sum + s.report.finalMetrics[key], 0) / total);

  res.json({
    totalSessions: total,
    avgPsychSafety: avg('psychologicalSafety'),
    avgLegal: avg('legalCompliance'),
    avgClarity: avg('clarityOfFeedback'),
    avgOverall: Math.round((avg('psychologicalSafety') + avg('legalCompliance') + avg('clarityOfFeedback')) / 3),
  });
});

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
          // Get the scenario ID from the message, default to performance review
          const scenarioId = message.scenarioId || 'perf-review-001';
          const scenario = getScenarioById(scenarioId);

          if (!scenario) {
            ws.send(JSON.stringify({
              type: 'error',
              message: `Scenario not found: ${scenarioId}`
            }));
            return;
          }

          // Create LLM provider
          const llm = createLLMProvider(config.llmProvider as 'gemini' | 'claude' | 'ollama');

          // Inject uploaded document context if available
          const sessionId = message.sessionId || 'default';
          const docContext = getDocumentContext(sessionId);
          const contextWithDocs = {
            ...message.context,
            ...(docContext ? { additionalContext: docContext } : {})
          };

          // Create scenario engine
          const engine = new ScenarioEngine(llm);
          await engine.initialize(scenario, contextWithDocs);

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

          logger.info('Scenario started', { scenarioId, scenarioName: scenario.name });
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

          // Persist to session store for Coach dashboard
          completedSessions.push({
            id: `session-${Date.now()}`,
            scenarioId: report.scenarioId,
            scenarioName: report.scenarioName,
            completedAt: new Date(),
            report,
          });

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
