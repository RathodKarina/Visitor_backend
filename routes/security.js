const express = require('express');
const router  = express.Router();
const Visit   = require('../models/Visit');
const { protect, isSecurity } = require('../middlewere/auth');

// All visits
router.get('/visits', protect, isSecurity, async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate('visitor', 'name email phone').sort({ createdAt: -1 });
    res.json(visits);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Today visits
router.get('/today', protect, isSecurity, async (req, res) => {
  try {
    const start = new Date(); start.setHours(0,0,0,0);
    const end   = new Date(); end.setHours(23,59,59,999);
    const visits = await Visit.find({ visitDate: { $gte: start, $lte: end } })
      .populate('visitor', 'name email phone');
    res.json(visits);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Approve
router.put('/approve/:id', protect, isSecurity, async (req, res) => {
  try {
    const visit = await Visit.findByIdAndUpdate(req.params.id,
      { status: 'approved', approvedBy: req.user._id }, { new: true });
    res.json(visit);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Reject
router.put('/reject/:id', protect, isSecurity, async (req, res) => {
  try {
    const visit = await Visit.findByIdAndUpdate(req.params.id,
      { status: 'rejected', approvedBy: req.user._id, remarks: req.body.remarks }, { new: true });
    res.json(visit);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Check In
router.put('/checkin/:id', protect, isSecurity, async (req, res) => {
  try {
    const visit = await Visit.findByIdAndUpdate(req.params.id,
      { status: 'checked-in', checkInTime: new Date() }, { new: true });
    res.json(visit);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Check Out
router.put('/checkout/:id', protect, isSecurity, async (req, res) => {
  try {
    const visit = await Visit.findByIdAndUpdate(req.params.id,
      { status: 'checked-out', checkOutTime: new Date() }, { new: true });
    res.json(visit);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;