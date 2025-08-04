const express = require('express');
const router = express.Router();
const campaignConfigController = require('../controllers/campaignConfigController');

router.post('/save', campaignConfigController.saveCampaignConfig);

module.exports = router;
