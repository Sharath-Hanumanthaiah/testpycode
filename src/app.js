const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const config = require('./config');
const logger = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
  logger.info({ event: 'request', method: req.method, url: req.url, ip: req.ip });
  next();
});

app.use('/auth', authRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/reports', reportRoutes);

app.use((err, req, res, next) => {
  logger.error({ event: 'unhandled_error', error: err });
  res.status(500).json({ success: false, message: 'Internal server error', errors: [err.message] });
});

mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  logger.info({ event: 'db_connected' });
  app.listen(3000, () => {
    logger.info({ event: 'server_started', port: 3000 });
  });
}).catch((err) => {
  logger.error({ event: 'db_connection_error', error: err });
});

module.exports = app;
