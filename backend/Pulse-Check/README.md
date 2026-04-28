
## Architecture Diagram

### Sequence Diagram — Normal Heartbeat Flow

```mermaid
sequenceDiagram
    participant Device as Remote Device
    participant API as Pulse-Check API
    participant Timer as Timer Service
    participant Alert as Alert Service

    Device->>API: POST /monitors {id, timeout, alert_email}
    API->>Timer: start(id, timeout)
    Timer-->>API: timer running
    API-->>Device: 201 Created

    loop Every < timeout seconds
        Device->>API: POST /monitors/:id/heartbeat
        API->>Timer: reset(id)
        Timer-->>API: timer restarted
        API-->>Device: 200 OK
    end

    Note over Timer: No heartbeat received within timeout
    Timer->>Alert: onExpired(id)
    Alert->>Alert: console.log ALERT JSON
    Alert->>Alert: simulateEmail(alert_email)
    Timer-->>API: monitor.status = 'down'
```

---


## Project Structure

```
Pulse-Check/
├─── app.js                      - Express app entry point
│   ├── routes/
│   │   ├── monitors.js             - Monitor route definitions
│   │   └── system.js               - Health-check & root routes
│   ├── controllers/
│   │   └── monitorController.js    - HTTP -> service mapping
│   ├── services/
│   │   ├── monitorStore.js         - In-memory Map (singleton)
│   │   ├── timerService.js         - setTimeout lifecycle management
│   │   ├── monitorService.js       - Business logic orchestration
│   │   └── alertService.js         - Alert firing + email simulation
│   ├── middleware/
│   │   ├── requestLogger.js        - Per-request logging
│   │   ├── errorHandler.js         - Global error handler
│   │   └── notFound.js             - 404 catch-all
│   └── utils/
│       ├── validators.js           - Input validation (no external libs)
│       └── time.js                 - Centralised ISO timestamp
├── package.json
├── .gitignore
└── README.md
```
