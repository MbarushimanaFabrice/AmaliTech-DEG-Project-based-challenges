'use strict';

const express = require('express');
const monitorRoutes = require('./routes/monitors');
const systemRoutes = require('./routes/system');
const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 4555;

app.use(express.json());
app.use(requestLogger);

app.use('/monitors', monitorRoutes);
app.use('/', systemRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n Pulse-Check API running on http://localhost:${PORT}`);
  console.log(` Watchdog sentinel is active. Monitoring for silent devices...\n`);
});

module.exports = app;
