const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

router.post('/save', templateController.saveTemplate);
router.get('/:campaignId', templateController.getTemplateByCampaign);
router.get('/export/:campaign_id', templateController.exportTemplateDocx);

module.exports = router;
