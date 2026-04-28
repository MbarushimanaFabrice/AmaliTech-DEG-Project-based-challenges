'use strict';
class MonitorStore {
  constructor() {
    this._monitors = new Map();
  }

  has(id) {
    return this._monitors.has(id);
  }

  get(id) {
    return this._monitors.get(id);
  }

  set(id, data) {
    this._monitors.set(id, data);
  }

  delete(id) {
    return this._monitors.delete(id);
  }

  all() {
    return Array.from(this._monitors.values());
  }

  get size() {
    return this._monitors.size;
  }
}

module.exports = new MonitorStore();
