const express = require('express');
const router  = express.Router();
const Visit   = require('../models/Visit');
const { protect } = require('../middlewere/auth');

// ================== SUBMIT VISIT ==================
router.post('/', protect, async (req, res) => {
  try {
    const { hostName, purpose, department, visitDate } = req.body;

    const visit = await Visit.create({
      visitor: req.user._id,
      hostName,
      purpose,
      department,
      visitDate
    });

    res.status(201).json(visit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== MY VISITS ==================
router.get('/my', protect, async (req, res) => {
  try {
    const visits = await Visit.find({ visitor: req.user._id })
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== ALL VISITS (ADMIN) ==================
router.get('/all', protect, async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate('visitor', 'name email')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== APPROVE / REJECT ==================
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body; // approved / rejected

    const visit = await Visit.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    visit.status = status;
    visit.approvedBy = req.user._id;

    await visit.save();

    res.json(visit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;