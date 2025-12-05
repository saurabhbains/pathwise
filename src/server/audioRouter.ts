// REST endpoints for testing audio pipeline

import { Router } from 'express';

export const audioRouter = Router();

// Placeholder routes
audioRouter.post('/test', (_req, res) => {
  res.json({ message: 'Audio test endpoint - not implemented yet' });
});
