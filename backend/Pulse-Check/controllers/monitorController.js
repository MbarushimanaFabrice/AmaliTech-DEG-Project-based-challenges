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

exports.heartbeat = (req, res, next) => {
  try {
    const { id } = req.params;
    const result = monitorService.heartbeat(id);

    if (!result.ok) {
      const status = result.code === 'NOT_FOUND' ? 404 : 400;
      return res.status(status).json({ error: result.message, code: result.code });
    }

    return res.status(200).json({
      message: result.message,
      monitor: result.monitor,
    });
  } catch (err) {
    next(err);
  }
};
exports.pause = (req, res, next) => {
  try {
    const { id } = req.params;
    const result = monitorService.pause(id);

    if (!result.ok) {
      const status = result.code === 'NOT_FOUND' ? 404 : 409;
      return res.status(status).json({ error: result.message, code: result.code });
    }

    return res.status(200).json({
      message: `Monitor '${id}' paused. Timer stopped. No alerts will fire.`,
      monitor: result.monitor,
    });
  } catch (err) {
    next(err);
  }
};