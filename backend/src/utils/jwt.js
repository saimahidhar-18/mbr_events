const jwt = require('jsonwebtoken');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function adminMiddleware(req, res, next) {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ error: 'Admin required' });
  next();
}

module.exports = { signToken, authMiddleware, adminMiddleware };
