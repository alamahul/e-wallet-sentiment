const express = require('express');
const authController = require('./auth.controller');
const { loginSchema } = require('./auth.validation');

// A simple validation middleware to validate Zod schemas
const validateRequest = schema => async (req, res, next) => {
  try {
    const validatedData = await schema.parseAsync(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    const ApiError = require('../../utils/api-error');
    if (error.name === 'ZodError') {
      const errs = error.errors || error.issues || [];
      const errors = errs.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      next(ApiError.validation('Validation failed', errors));
    } else {
      next(error);
    }
  }
};

const router = express.Router();

router.post('/login', validateRequest(loginSchema), authController.login);

module.exports = router;
