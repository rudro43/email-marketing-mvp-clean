const express = require('express');
const router = express.Router();
const {
  createCampaign,
  getAllCampaigns,
  getCampaignByCampaignId,
  updateCampaignMetrics
} = require('../controllers/campaignController');

router.post('/', createCampaign);                      // Create campaign
router.get('/', getAllCampaigns);                      // List all campaigns
router.get('/id/:campaign_id', getCampaignByCampaignId); // Fetch by campaign_id
router.put('/id/:campaign_id/metrics', updateCampaignMetrics); 
router.get('/', async (req, res) => {
  try {
    const campaigns = await campaigns.find({});
    res.json(campaigns);
  } catch (err) {
    console.error('Error fetching campaigns:', err);
    res.status(500).json({ error: 'Failed to load campaigns' });
  }
});
// Optional metrics update

module.exports = router;
