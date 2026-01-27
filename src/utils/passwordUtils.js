const crypto = require('crypto');

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,12}$/;

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function validatePassword(password, user) {
  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      message: 'Password must be 8-12 characters, include uppercase, lowercase, number, and symbol.',
    };
  }
  if (user) {
    if (user.previousPasswords && user.previousPasswords.includes(hashPassword(password))) {
      return {
        valid: false,
        message: 'Password must not match previous passwords.',
      };
    }
    const lowerPassword = password.toLowerCase();
    if (lowerPassword.includes(user.firstName.toLowerCase()) || lowerPassword.includes(user.lastName.toLowerCase()) || lowerPassword.includes(user.email.split('@')[0].toLowerCase())) {
      return {
        valid: false,
        message: 'Password must not contain account/real names.',
      };
    }
    // Optionally check for dictionary words (not implemented for brevity)
  }
  return { valid: true };
}

module.exports = {
  hashPassword,
  validatePassword,
};
