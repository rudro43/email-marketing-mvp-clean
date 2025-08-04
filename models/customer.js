const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  email_id: { type: String, required: true },
  name: String,
  country: String,
  size: String,
  products: [String],
  market_value: Number,
  frequent_purchase: String,
  LCV: Number,
  segments: [String],
  last_purchase: Date,
  created_at: Date
});

module.exports = mongoose.model('Customer', CustomerSchema, 'CUSTOMERS');
