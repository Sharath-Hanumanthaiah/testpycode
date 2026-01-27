const User = require('../../domain/models/User');

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

const findById = async (userId) => {
  return await User.findById(userId);
};

module.exports = {
  findByEmail,
  createUser,
  updateUser,
  findById,
};
