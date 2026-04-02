const jwt  = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch {
      return res.status(401).json({ message: 'Token failed' });
    }
  }
  if (!token) return res.status(401).json({ message: 'No token' });
};

const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin only' });
};

const isSecurity = (req, res, next) => {
  if (['security','admin'].includes(req.user?.role)) return next();
  return res.status(403).json({ message: 'Security only' });
};

module.exports = { protect, isAdmin, isSecurity };