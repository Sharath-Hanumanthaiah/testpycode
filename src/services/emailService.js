const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port == 465, // true for 465, false for other ports
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

transporter.verify(function(error, success) {
  if (error) {
    logger.error({ event: 'smtp_connection_failed', error });
  } else {
    logger.info({ event: 'smtp_connection_success', message: 'SMTP server is ready to take messages' });
  }
});

/**
 * Send OTP email for verification
 * @param {string} to - Recipient email address
 * @param {string} otp - OTP code
 * @returns {Promise<boolean>} - True if sent, false otherwise
 */
async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: config.smtp.from,
    to,
    subject: 'ElevanceNet Email Verification OTP',
    text: `Your OTP for email verification is: ${otp}. It expires in ${config.otp.expirySeconds} seconds.`,
  };
  try {
    await transporter.sendMail(mailOptions);
    logger.info({ event: 'email_sent', to, purpose: 'otp_verification' });
    return true;
  } catch (error) {
    logger.error({ event: 'email_send_failed', to, error });
    return false;
  }
}

/**
 * Send password reset email
 * @param {string} to - Recipient email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise<boolean>} - True if sent, false otherwise
 */
async function sendPasswordResetEmail(to, resetToken) {
  const mailOptions = {
    from: config.smtp.from,
    to,
    subject: 'ElevanceNet Password Reset',
    text: `You requested a password reset. Use this token to reset your password: ${resetToken}. If you did not request this, please ignore this email.`,
  };
  try {
    await transporter.sendMail(mailOptions);
    logger.info({ event: 'email_sent', to, purpose: 'password_reset' });
    return true;
  } catch (error) {
    logger.error({ event: 'email_send_failed', to, error });
    return false;
  }
}

module.exports = {
  sendOtpEmail,
  sendPasswordResetEmail,
};
