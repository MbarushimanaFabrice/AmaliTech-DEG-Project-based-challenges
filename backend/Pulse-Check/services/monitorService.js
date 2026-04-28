'use strict';

const monitorStore = require('./monitorStore');
const timerService = require('./timerService');
const { formatISO } = require('../utils/time');
class MonitorService {
  create({ id, timeout, alert_email }) {
    if (monitorStore.has(id)) {
      return {
        ok: false,
        code: 'DUPLICATE_ID',
        message: `Monitor '${id}' already exists. Use DELETE /monitors/${id} to remove it first, or send a heartbeat to reset the timer.`,
      };
    }

    const monitor = {
      id,
      timeout,
      alert_email,
      status: 'active',
      createdAt: formatISO(),
      lastHeartbeat: null,
      alertFiredAt: null,
      missedBeats: 0,
    };

    monitorStore.set(id, monitor);
    timerService.start(id);

    return { ok: true, monitor };
  }

  heartbeat(id) {
    if (!monitorStore.has(id)) {
      return {
        ok: false,
        code: 'NOT_FOUND',
        message: `Monitor '${id}' not found.`,
      };
    }

    const monitor = monitorStore.get(id);
    const previousStatus = monitor.status;

    monitor.lastHeartbeat = formatISO();
    monitor.status = 'active';
    monitorStore.set(id, monitor);

    timerService.reset(id);

    const message =
      previousStatus === 'paused'
        ? `Monitor '${id}' resumed. Timer restarted.`
        : previousStatus === 'down'
        ? `Monitor '${id}' recovered. Timer restarted.`
        : `Heartbeat received. Timer reset for '${id}'.`;

    return { ok: true, monitor, message };
  }

  pause(id) {
    if (!monitorStore.has(id)) {
      return {
        ok: false,
        code: 'NOT_FOUND',
        message: `Monitor '${id}' not found.`,
      };
    }

    const monitor = monitorStore.get(id);

    if (monitor.status === 'paused') {
      return {
        ok: false,
        code: 'ALREADY_PAUSED',
        message: `Monitor '${id}' is already paused.`,
      };
    }

    if (monitor.status === 'down') {
      return {
        ok: false,
        code: 'MONITOR_DOWN',
        message: `Monitor '${id}' is already down. Send a heartbeat to revive it.`,
      };
    }

    timerService.stop(id);
    monitor.status = 'paused';
    monitorStore.set(id, monitor);

    return { ok: true, monitor };
  }

  resume(id) {
    if (!monitorStore.has(id)) {
      return {
        ok: false,
        code: 'NOT_FOUND',
        message: `Monitor '${id}' not found.`,
      };
    }

    const monitor = monitorStore.get(id);

    if (monitor.status !== 'paused') {
      return {
        ok: false,
        code: 'NOT_PAUSED',
        message: `Monitor '${id}' is not paused (current status: ${monitor.status}).`,
      };
    }

    monitor.status = 'active';
    monitorStore.set(id, monitor);
    timerService.start(id);

    return { ok: true, monitor };
  }

  get(id) {
    if (!monitorStore.has(id)) {
      return {
        ok: false,
        code: 'NOT_FOUND',
        message: `Monitor '${id}' not found.`,
      };
    }
    return { ok: true, monitor: monitorStore.get(id) };
  }

  list(statusFilter) {
    let monitors = monitorStore.all();
    if (statusFilter) {
      monitors = monitors.filter((m) => m.status === statusFilter);
    }
    return { ok: true, monitors, total: monitors.length };
  }

  delete(id) {
    if (!monitorStore.has(id)) {
      return {
        ok: false,
        code: 'NOT_FOUND',
        message: `Monitor '${id}' not found.`,
      };
    }

    timerService.stop(id);
    monitorStore.delete(id);

    return { ok: true, message: `Monitor '${id}' deleted successfully.` };
  }

  stats() {
    const all = monitorStore.all();
    const counts = { active: 0, paused: 0, down: 0 };
    for (const m of all) counts[m.status] = (counts[m.status] || 0) + 1;

    return {
      ok: true,
      stats: {
        total: all.length,
        by_status: counts,
        total_missed_beats: all.reduce((sum, m) => sum + m.missedBeats, 0),
        generatedAt: formatISO(),
      },
    };
  }
}

module.exports = new MonitorService();
