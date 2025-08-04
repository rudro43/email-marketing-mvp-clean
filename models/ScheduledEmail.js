const mongoose = require('mongoose');

const ScheduledEmailSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  segment_key: String,
  email_text: String,
  scheduled_time: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScheduledEmail', ScheduledEmailSchema);
