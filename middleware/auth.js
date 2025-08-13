const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.redirect('/auth/login');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.redirect('/auth/login');

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error', err.message);
    return res.redirect('/auth/login');
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).send('Forbidden');
};

module.exports = { authMiddleware, adminOnly };