const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  otpHash: { type: String, required: true },
  purpose: { type: String, required: true }, // e.g., 'email_verification'
  channel: { type: String, required: true }, // e.g., 'email'
  expiresAt: { type: Date, required: true },
  consumedAt: { type: Date, default: null },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Otp', otpSchema);
