const morgan = require('morgan');
const logger = require('../config/logger.config');

const stream = {
  write: message => {
    logger.info(message.trim());
  }
};

const morganFormat =
  ':method :url :status :res[content-length] - :response-time ms';

// Morgan middleware
const loggerMiddleware = morgan(morganFormat, {
  stream: stream,
  skip: (req, _res) => req.url === '/api/health' // Skip untuk endpoint health
});

module.exports = loggerMiddleware;
