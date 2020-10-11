const keys = require('../config/keys');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ error: true, message: 'no_token' });
  }
  try {
    const decoded = jwt.verify(token, keys.jwtSecret);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ error: true, message: 'invalid_token' });
  }
}

module.exports = auth;