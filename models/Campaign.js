const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  campaign_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  date: String, // or convert to Date if possible
  time: String,
  customer_list: String,
  opened: { type: Number, default: 0 },
  clicked: { type: Number, default: 0 },
  responded: { type: Number, default: 0 },
  purchased: { type: Number, default: 0 },
  content: String, // filename or HTML body
  cost: Number,
  segment: String,
  status: { type: String, default: 'draft' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', CampaignSchema, 'CAMPAIGNS');
