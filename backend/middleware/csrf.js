const crypto = require('crypto');

const csrfProtection = (req, res, next) => {
  if (req.method === 'GET') {
    return next();
  }

  // Skip CSRF in development if no session exists
  if (process.env.NODE_ENV === 'development' && !req.session) {
    console.warn('CSRF protection skipped - no session in development mode');
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token && !sessionToken) {
    console.warn('CSRF protection skipped - no tokens available');
    return next();
  }

  if (token && sessionToken && token !== sessionToken) {
    return res.status(403).json({ message: 'Invalid CSRF token. Please refresh the page and try again.' });
  }

  next();
};

const generateToken = (req, res, next) => {
  if (!req.session) {
    req.session = {};
  }
  req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  res.locals.csrfToken = req.session.csrfToken;
  next();
};

module.exports = { csrfProtection, generateToken };