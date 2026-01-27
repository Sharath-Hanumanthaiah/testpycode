function formatResponse({ success, message, data = null, errors = null, meta = null }) {
  return {
    success,
    message,
    data,
    errors,
    meta,
  };
}

module.exports = formatResponse;
