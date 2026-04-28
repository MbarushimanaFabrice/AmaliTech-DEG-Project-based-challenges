'use strict';

const monitorStore = require('./monitorStore');
const alertService = require('./alertService');
const { formatISO } = require('../utils/time');
class TimerService {
  constructor() {
    this._timers = new Map();
  }

  start(id) {
    this._clearTimer(id);

    const monitor = monitorStore.get(id);
    if (!monitor) return;

    const handle = setTimeout(() => {
      this._onExpired(id);
    }, monitor.timeout * 1000);

    if (handle.unref) handle.unref();

    this._timers.set(id, handle);
  }

  stop(id) {
    this._clearTimer(id);
  }

  reset(id) {
    this.start(id);
  }

  stopAll() {
    for (const id of this._timers.keys()) {
      this._clearTimer(id);
    }
  }

  _onExpired(id) {
    const monitor = monitorStore.get(id);
    if (!monitor) return;

    if (monitor.status === 'paused') {
      this._timers.delete(id);
      return;
    }

    monitor.status = 'down';
    monitor.alertFiredAt = formatISO();
    monitor.missedBeats += 1;
    monitorStore.set(id, monitor);

    this._timers.delete(id);

    alertService.fireDownAlert(monitor);
  }

  _clearTimer(id) {
    if (this._timers.has(id)) {
      clearTimeout(this._timers.get(id));
      this._timers.delete(id);
    }
  }
}

module.exports = new TimerService();
