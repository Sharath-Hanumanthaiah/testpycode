const authService = require('../services/authService');
const formatResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');

async function signup(req, res) {
  try {
    const { firstName, lastName, email, password, agreedToPrivacy, agreedToTerms } = req.body;
    const result = await authService.signup({ firstName, lastName, email, password, agreedToPrivacy, agreedToTerms });
    logger.info({ event: 'signup_attempt', email, status: result.status });
    res.status(result.status).json(formatResponse(result.response));
  } catch (error) {
    logger.error({ event: 'signup_error', error });
    res.status(500).json(formatResponse({ success: false, message: 'Internal server error', errors: [error.message] }));
  }
}

async function verify(req, res) {
  try {
    const { userId, otp } = req.body;
    const result = await authService.verifyOtp({ userId, otp });
    logger.info({ event: 'verify_attempt', userId, status: result.status });
    if (result.status === 200 && result.response.data && result.response.data.token) {
      res.cookie('token', result.response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    res.status(result.status).json(formatResponse(result.response));
  } catch (error) {
    logger.error({ event: 'verify_error', error });
    res.status(500).json(formatResponse({ success: false, message: 'Internal server error', errors: [error.message] }));
  }
}

module.exports = {
  signup,
  verify,
};
