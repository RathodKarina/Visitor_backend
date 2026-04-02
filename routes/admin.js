const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const Visit   = require('../models/Visit');
const { protect, isAdmin } = require('../middlewere/auth');

// All users
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create security officer
router.post('/create-officer', protect, isAdmin, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, password, phone, role: 'security' });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete user
router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// All visits
router.get('/visits', protect, isAdmin, async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate('visitor', 'name email phone')
      .populate('approvedBy', 'name').sort({ createdAt: -1 });
    res.json(visits);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Dashboard stats
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const totalVisitors  = await User.countDocuments({ role: 'visitor' });
    const totalOfficers  = await User.countDocuments({ role: 'security' });
    const totalVisits    = await Visit.countDocuments();
    const pendingVisits  = await Visit.countDocuments({ status: 'pending' });
    const approvedVisits = await Visit.countDocuments({ status: 'approved' });
    const rejectedVisits = await Visit.countDocuments({ status: 'rejected' });
    const start = new Date(); start.setHours(0,0,0,0);
    const end   = new Date(); end.setHours(23,59,59,999);
    const todayVisits = await Visit.countDocuments({ createdAt: { $gte: start, $lte: end } });
    res.json({ totalVisitors, totalOfficers, totalVisits, pendingVisits, approvedVisits, rejectedVisits, todayVisits });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;