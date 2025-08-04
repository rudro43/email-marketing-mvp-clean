// utils/getCampaignInteractionModel.js
const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
  email_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Email', required: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  opened: { type: Boolean, default: false },
  open_count: { type: Number, default: 0 },
  link_clicked: { type: Boolean, default: false },
  click_count: { type: Number, default: 0 },
  scrolled: { type: Boolean, default: false },
  last_interaction: { type: Date, default: null },
});

// Return or create a dynamic model for a given campaign_id
module.exports = function getCampaignInteractionModel(campaignId) {
  return mongoose.model(
    campaignId, // collection name = campaign ID
    InteractionSchema,
    campaignId // explicit collection name
  );
};
