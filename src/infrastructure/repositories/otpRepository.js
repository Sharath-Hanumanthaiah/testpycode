const Otp = require('../../domain/models/Otp');

const createOtp = async (otpData) => {
  const otp = new Otp(otpData);
  return await otp.save();
};

const findValidOtp = async (userId, purpose) => {
  const now = new Date();
  return await Otp.findOne({
    userId,
    purpose,
    consumedAt: null,
    expiresAt: { $gt: now },
    attempts: { $lt: Otp.schema.paths.maxAttempts.defaultValue },
  });
};

const updateOtp = async (otpId, updateData) => {
  return await Otp.findByIdAndUpdate(otpId, updateData, { new: true });
};

module.exports = {
  createOtp,
  findValidOtp,
  updateOtp,
};
