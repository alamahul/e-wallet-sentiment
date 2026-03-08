const authService = require('./auth.service');
const STATUS_CODES = require('../../utils/status-code');

const login = async (req, res, next) => {
  try {
    const tokens = await authService.login(req.body);
    res.status(STATUS_CODES.OK).json({
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login
};
