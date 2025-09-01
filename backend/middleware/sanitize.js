const sanitizeForLog = (input) => {
  if (typeof input !== 'string') {
    input = String(input);
  }
  return encodeURIComponent(input);
};

module.exports = { sanitizeForLog };