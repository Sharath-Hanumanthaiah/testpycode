require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
  appUrl: process.env.APP_URL,
  logLevel: process.env.LOG_LEVEL || 'info',
  otpExpirySeconds: process.env.OTP_EXPIRY_SECONDS || 30,
  otpMaxAttempts: process.env.OTP_MAX_ATTEMPTS || 5,
};
