'use strict';

const monitorService = require('../services/monitorService');
const { validateCreateMonitor } = require('../utils/validators');
exports.create = (req, res, next) => {
  try {
    const { error, value } = validateCreateMonitor(req.body);
    if (error) return res.status(400).json({ error: 'Validation failed', details: error });

    const result = monitorService.create(value);
    if (!result.ok) {
      const status = result.code === 'DUPLICATE_ID' ? 409 : 400;
      return res.status(status).json({ error: result.message, code: result.code });
    }

    return res.status(201).json({
      message: `Monitor '${result.monitor.id}' created. Countdown started (${result.monitor.timeout}s).`,
      monitor: result.monitor,
    });
  } catch (err) {
    next(err);
  }
};