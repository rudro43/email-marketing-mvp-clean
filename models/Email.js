// File: backend/models/Email.js
const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  campaign_id: String,
  customer_id: mongoose.Schema.Types.ObjectId,
  email_content: String,
  generated_at: { type: Date, default: Date.now },
  sent: { type: Boolean, default: false },
  sent_at: { type: Date }
});


module.exports = mongoose.model('Email', EmailSchema, 'EMAILS');
