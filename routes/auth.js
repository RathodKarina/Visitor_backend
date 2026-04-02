const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/user');
const { protect } = require('../middlewere/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    
    const validRole = ['visitor', 'security', 'admin'].includes(role) ? role : 'visitor';
    const user = await User.create({ name, email, password, phone, role: validRole });
    
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Me
router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;