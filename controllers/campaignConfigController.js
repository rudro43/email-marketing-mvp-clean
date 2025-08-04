const CampaignConfig = require('../models/CampaignConfig');

exports.saveCampaignConfig = async (req, res) => {
  const { campaign_id, filters_applied, template_doc_url } = req.body;

  if (!campaign_id || !filters_applied) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const config = await CampaignConfig.findOneAndUpdate(
      { campaign_id },
      { campaign_id, filters_applied, template_doc_url },
      { upsert: true, new: true }
    );

    res.json({ message: 'Campaign config saved', config });
  } catch (err) {
    console.error('Error saving campaign config:', err);
    res.status(500).json({ error: 'Failed to save campaign config' });
  }
};
