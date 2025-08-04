// File: models/Schedule.js
const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  campaign_id: String,
  customer_email: String,
  email_subject: String,
  email_html: String,
  scheduled_time: Date,
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
