'use strict';

exports.validateCreateMonitor = (body) => {
  const { id, timeout, alert_email } = body || {};
  const errors = [];

  if (id === undefined || id === null) {
    errors.push('"id" is required.');
  } else if (typeof id !== 'string') {
    errors.push('"id" must be a string.');
  } else if (id.trim().length === 0) {
    errors.push('"id" cannot be empty.');
  } else if (!/^[\w\-]+$/.test(id.trim())) {
    errors.push('"id" may only contain letters, numbers, underscores, and hyphens.');
  } else if (id.trim().length > 100) {
    errors.push('"id" must be 100 characters or fewer.');
  }

  if (timeout === undefined || timeout === null) {
    errors.push('"timeout" is required.');
  } else if (typeof timeout !== 'number' || !Number.isInteger(timeout)) {
    errors.push('"timeout" must be an integer (seconds).');
  } else if (timeout < 1) {
    errors.push('"timeout" must be at least 1 second.');
  } else if (timeout > 86400) {
    errors.push('"timeout" cannot exceed 86400 seconds (24 hours).');
  }

  if (alert_email === undefined || alert_email === null) {
    errors.push('"alert_email" is required.');
  } else if (typeof alert_email !== 'string') {
    errors.push('"alert_email" must be a string.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alert_email.trim())) {
    errors.push('"alert_email" must be a valid email address.');
  }

  if (errors.length > 0) {
    return { error: errors.join(' '), value: null };
  }

  return {
    error: null,
    value: {
      id: id.trim(),
      timeout,
      alert_email: alert_email.trim().toLowerCase(),
    },
  };
};
