const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: false,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

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

module.exports = {
  sendOtpEmail,
};
