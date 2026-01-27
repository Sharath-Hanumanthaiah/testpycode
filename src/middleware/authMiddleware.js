const jwt = require('jsonwebtoken');
const config = require('../config');
const userRepository = require('../infrastructure/repositories/userRepository');

async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided', errors: ['Unauthorized'], data: null });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found', errors: ['Unauthorized'], data: null });
    }
    req.user = {
      _id: user._id,
      email: user.email,
      emailVerified: user.emailVerified,
      preferences: user.preferences || [],
    };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token', errors: [err.message], data: null });
  }
}

function requireEmailVerified(req, res, next) {
  if (!req.user || !req.user.emailVerified) {
    return res.status(401).json({ success: false, message: 'Email not verified', errors: ['Email not verified'], data: null });
  }
  next();
}

module.exports = { authenticateJWT, requireEmailVerified };
