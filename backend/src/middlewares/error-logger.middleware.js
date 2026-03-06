const logger = require('../config/logger.config');

/**
 * Global Handle error
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
const errorHandleMiddleware = (err, req, res, _next) => {
  logger.error(err.stack);

  // error
  const DEFAULT_CODE_ERROR = 500;
  res.status(err.statusCode || err.status || DEFAULT_CODE_ERROR).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(err.errors && { errors: err.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandleMiddleware;
