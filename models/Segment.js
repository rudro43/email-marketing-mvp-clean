const mongoose = require('mongoose');

const SegmentSchema = new mongoose.Schema({
  segment: String,
  name: String,
  characteristic1: String,
  characteristic2: String,
  paracatemol: Boolean,
  priority: Number,
  created_at: Date
});

module.exports = mongoose.model('Segment', SegmentSchema, 'SEGMENTS');
