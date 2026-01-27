// Standard API response formatter
module.exports = function responseFormatter(status, success, message, data = null, errors = null, meta = null) {
  return {
    status,
    success,
    message,
    data,
    errors,
    meta,
  };
};
