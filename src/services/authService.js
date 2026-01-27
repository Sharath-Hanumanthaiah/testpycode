const userRepo = require('../infrastructure/repositories/userRepository');
const { hashPassword } = require('../utils/passwordUtils');
const config = require('../config');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

async function login({ email, password }) {
  if (!email || !password) {
    return {
      status: 400,
      response: {
        success: false,
        message: 'Email and password are required',
        errors: ['Missing credentials'],
        data: null,
        meta: null,
      },
    };
  }
  const user = await userRepo.findByEmail(email);
  if (!user) {
    logger.warn({ event: 'login_failed', email, reason: 'User not found' });
    return {
      status: 401,
      response: {
        success: false,
        message: 'Incorrect email or password',
        errors: ['Invalid credentials'],
        data: null,
        meta: null,
      },
    };
  }
  if (!user.isVerified) {
    logger.warn({ event: 'login_failed', email, reason: 'Email not verified' });
    return {
      status: 403,
      response: {
        success: false,
        message: 'Email not verified. Please verify your email before logging in.',
        errors: ['Email not verified'],
        data: null,
        meta: null,
      },
    };
  }
  const passwordHash = hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    logger.warn({ event: 'login_failed', email, reason: 'Incorrect password' });
    return {
      status: 401,
      response: {
        success: false,
        message: 'Incorrect email or password',
        errors: ['Invalid credentials'],
        data: null,
        meta: null,
      },
    };
  }
  // Issue JWT
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
  logger.info({ event: 'login_success', userId: user._id, email });
  return {
    status: 200,
    response: {
      success: true,
      message: 'Login successful',
      data: { token },
      errors: null,
      meta: { expiresIn: config.jwt.expiresIn },
    },
  };
}

async function refreshToken({ token }) {
  try {
    const payload = jwt.verify(token, config.jwt.secret, { ignoreExpiration: true });
    // Optionally check if user still exists and is verified
    const user = await userRepo.findById(payload.userId);
    if (!user || !user.isVerified) {
      return {
        status: 401,
        response: {
          success: false,
          message: 'User not found or not verified',
          errors: ['Invalid user'],
          data: null,
          meta: null,
        },
      };
    }
    // Issue new token
    const newToken = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    logger.info({ event: 'token_refreshed', userId: user._id });
    return {
      status: 200,
      response: {
        success: true,
        message: 'Token refreshed',
        data: { token: newToken },
        errors: null,
        meta: { expiresIn: config.jwt.expiresIn },
      },
    };
  } catch (err) {
    logger.warn({ event: 'token_refresh_failed', error: err.message });
    return {
      status: 401,
      response: {
        success: false,
        message: 'Invalid or expired token',
        errors: [err.message],
        data: null,
        meta: null,
      },
    };
  }
}

module.exports = {
  login,
  refreshToken,
};
