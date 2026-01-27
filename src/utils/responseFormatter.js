function formatResponse({ success, message, data = null, errors = null, meta = null }) {
  return {
    success: !!success,
    message: message || '',
    data,
    errors,
    meta,
  };
}

module.exports = formatResponse;
