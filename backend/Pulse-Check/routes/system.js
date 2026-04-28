'use strict';

const { Router } = require('express');
const { formatISO } = require('../utils/time');

const router = Router();
const START_TIME = Date.now();

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Pulse-Check API',
    uptime_seconds: Math.floor((Date.now() - START_TIME) / 1000),
    timestamp: formatISO(),
  });
});
 
router.get('/', (_req, res) => {
  res.status(200).json({
    service: 'Pulse-Check API — Watchdog Sentinel',
    version: '1.0.0',
    description: 'Dead Man\'s Switch API for CritMon Servers Inc.',
    endpoints: {
      'POST /monitors': 'Register a new device monitor',
      'GET /monitors': 'List all monitors (optional ?status=active|paused|down)',
      'GET /monitors/stats': 'Aggregate stats across all monitors',
      'GET /monitors/:id': 'Get a single monitor',
      'DELETE /monitors/:id': 'Remove a monitor',
      'POST /monitors/:id/heartbeat': 'Send a heartbeat (reset timer)',
      'POST /monitors/:id/pause': 'Pause monitoring (stop timer)',
      'POST /monitors/:id/resume': 'Resume a paused monitor',
      'GET /health': 'Health check',
    },
  });
});

module.exports = router;
