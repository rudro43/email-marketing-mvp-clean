const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const Campaign = require('../models/Campaign');

// 🔹 Get emails by campaign
router.get('/by-campaign/:campaign_id', emailController.getEmailsByCampaign);

// 🔹 Get all campaigns (needed by ViewEmailsPage)
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find({});
    res.json(campaigns);
  } catch (err) {
    console.error('Failed to fetch campaigns:', err);
    res.status(500).json({ error: 'Server error fetching campaigns' });
  }
});

// 🔹 Generate batch emails by segment
router.post('/generate/segment/:segment', emailController.generateBatchBySegment);

// 🔹 Generate batch emails and create campaign
router.post('/generate/with-campaign', emailController.generateEmailsWithCampaign);
router.post('/send-batch/:campaign_id', emailController.sendCampaignEmails);



module.exports = router;
