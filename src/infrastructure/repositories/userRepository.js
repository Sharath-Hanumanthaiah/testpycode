const User = require('../../domain/models/User');

class UserRepository {
  async findById(userId) {
    return await User.findById(userId);
  }
}

module.exports = new UserRepository();
