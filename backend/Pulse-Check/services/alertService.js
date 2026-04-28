'use strict';

const { formatISO } = require('../utils/time');
class AlertService {
  fireDownAlert(monitor) {
    const payload = {
      ALERT: `Device ${monitor.id} is down!`,
      device_id: monitor.id,
      alert_email: monitor.alert_email,
      time: formatISO(),
      missed_beats: monitor.missedBeats,
      last_heartbeat: monitor.lastHeartbeat ?? 'never',
    };

    console.error('\nALERT FIRED:\n', JSON.stringify(payload, null, 2), '\n');
    this._simulateEmail(payload);

    return payload;
  }

  _simulateEmail(payload) {
    console.log(
      `[SIMULATED EMAIL] To: ${payload.alert_email} | Subject: DEVICE DOWN - ${payload.device_id} | Body: ${payload.ALERT}`
    );
  }
}

module.exports = new AlertService();
