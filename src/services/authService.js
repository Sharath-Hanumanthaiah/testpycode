const userRepo = require('../infrastructure/repositories/userRepository');
const otpRepo = require('../infrastructure/repositories/otpRepository');
const { hashPassword, validatePassword } = require('../utils/passwordUtils');
const { sendOtpEmail } = require('./emailService');
const config = require('../config');
const crypto = require('crypto');
const logger = require('../utils/logger');

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

async function signup({ firstName, lastName, email, password, agreedToPrivacy, agreedToTerms }) {
  // Input validation
  if (!firstName || !lastName || !email || !password || agreedToPrivacy !== true || agreedToTerms !== true) {
    return { status: 400, response: { success: false, message: 'Missing or invalid fields', errors: ['All fields required, must agree to privacy/terms.'] } };
  }
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    return { status: 409, response: { success: false, message: 'Email already registered', errors: ['Duplicate email'] } };
  }
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    return { status: 400, response: { success: false, message: 'Invalid password', errors: [passwordCheck.message] } };
  }
  const passwordHash = hashPassword(password);
  const user = await userRepo.createUser({
    firstName,
    lastName,
    email,
    passwordHash,
    agreedToPrivacy,
    agreedToTerms,
    previousPasswords: [passwordHash],
    isVerified: false,
  });
  logger.info({ event: 'user_signup', userId: user._id, email });
  // Generate OTP
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + config.otp.expirySeconds * 1000);
  await otpRepo.createOtp({
    userId: user._id,
    otpHash,
    purpose: 'email_verification',
    channel: 'email',
    expiresAt,
    attempts: 0,
    maxAttempts: config.otp.maxAttempts,
  });
  await sendOtpEmail(email, otp);
  return { status: 200, response: { success: true, message: 'Signup successful, OTP sent to email', data: { userId: user._id } } };
}

async function verifyOtp({ userId, otp }) {
  const user = await userRepo.findById(userId);
  if (!user) {
    return { status: 404, response: { success: false, message: 'User not found', errors: ['User not found'] } };
  }
  if (user.isVerified) {
    return { status: 200, response: { success: true, message: 'User already verified', data: null } };
  }
  const otpDoc = await otpRepo.findValidOtp(userId, 'email_verification');
  if (!otpDoc) {
    return { status: 404, response: { success: false, message: 'OTP expired or not found', errors: ['OTP expired or not found'] } };
  }
  if (otpDoc.attempts >= otpDoc.maxAttempts) {
    return { status: 400, response: { success: false, message: 'Maximum OTP attempts exceeded', errors: ['Max attempts exceeded'] } };
  }
  if (otpDoc.expiresAt < new Date()) {
    return { status: 404, response: { success: false, message: 'OTP expired', errors: ['OTP expired'] } };
  }
  if (otpDoc.otpHash !== hashOtp(otp)) {
    await otpRepo.updateOtp(otpDoc._id, { $inc: { attempts: 1 } });
    logger.warn({ event: 'otp_incorrect', userId, attempts: otpDoc.attempts + 1 });
    return { status: 400, response: { success: false, message: 'Incorrect OTP', errors: ['Incorrect OTP'] } };
  }
  await otpRepo.updateOtp(otpDoc._id, { consumedAt: new Date(), attempts: otpDoc.attempts + 1 });
  await userRepo.updateUser(userId, { isVerified: true });
  logger.info({ event: 'otp_verified', userId });
  // Generate JWT
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ userId: user._id, email: user.email }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  return { status: 200, response: { success: true, message: 'Email verified, authentication granted', data: { token } } };
}

  await sendOtpEmail(email, otp);
  return { status: 200, response: { success: true, message: 'Signup successful, OTP sent to email', data: { userId: user._id } } };
}

async function sendPasswordReset({ email, resetToken }) {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    return { status: 404, response: { success: false, message: 'User not found', errors: ['User not found'] } };
  }
  const sent = await require('./emailService').sendPasswordResetEmail(email, resetToken);
  if (!sent) {
    return { status: 500, response: { success: false, message: 'Failed to send password reset email', errors: ['Email delivery failed'] } };
  }
  logger.info({ event: 'password_reset_email_sent', email });
  return { status: 200, response: { success: true, message: 'Password reset email sent', data: null } };
}

module.exports = {
  signup,
  verifyOtp,
  sendPasswordReset,
};
