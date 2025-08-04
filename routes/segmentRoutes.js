const express = require('express');
const router = express.Router();
const { getSegmentCustomers } = require('../controllers/segmentController');
const Segment = require('../models/Segment'); // ✅ You missed this import!

// Get customers for a given segment ID
router.get('/:id/customers', getSegmentCustomers);

// Get all segments
router.get('/', async (req, res) => {
  try {
    const segments = await Segment.find();
    res.json(segments);
  } catch (err) {
    console.error('Error fetching segments:', err);
    res.status(500).json({ error: 'Server error fetching segments' });
  }
});

module.exports = router;
