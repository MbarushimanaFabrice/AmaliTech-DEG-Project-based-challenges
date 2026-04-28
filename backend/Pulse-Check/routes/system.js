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
  