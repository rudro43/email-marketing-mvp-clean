// models/Template.js
const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  campaign_id: { type: String, required: true },
  html: { type: String, required: true },
});

module.exports = mongoose.model('Template', TemplateSchema,'TEMPLATES');
