const mongoose = require('mongoose');

const CampaignConfigSchema = new mongoose.Schema({
  campaign_id: { type: String, required: true, unique: true },
  filters_applied: { type: Array, required: true }, // Array of filter objects or conditions
  template_doc_url: { type: String }, // Optional link to the generated .doc file
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CampaignConfig', CampaignConfigSchema,'CAMPAIGNCONFIG');
