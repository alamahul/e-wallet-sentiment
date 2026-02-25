const express = require('express');
const loggerMiddleware = require('./middlewares/logging.middleware');
const errorHandleMiddleware = require('./middlewares/error-logger.middleware');
const app = express();

const createApp = () => {
  // MIDDLEWARE
  // -------------
  app.use(express.json());

  // Logging
  app.use(loggerMiddleware);

  // ENDPOINT
  // -------------

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'e-wallet-sentiment-backend' });
  });

  // Handle Error API
  app.use(errorHandleMiddleware);

  return app;
};

module.exports = createApp;
