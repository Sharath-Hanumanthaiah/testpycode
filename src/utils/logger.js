const { createLogger, format, transports } = require('winston');
const config = require('../config');

const logger = createLogger({
  level: config.logLevel,
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
  ],
});

// Audit log helper for user actions
logger.audit = function (action, details = {}) {
  logger.info({ event: 'audit', action, ...details });
};

module.exports = logger;
