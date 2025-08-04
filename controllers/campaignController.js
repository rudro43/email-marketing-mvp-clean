const Campaign = require('../models/Campaign');

// Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const {
      campaign_id,
      name,
      date,
      time,
      customer_list,
      content,
      cost,
      segment,
      status
    } = req.body;

    const newCampaign = new Campaign({
      campaign_id,
      name,
      date,
      time,
      customer_list,
      content,
      cost,
      segment,
      status: status || 'draft'
    });

    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (err) {
    console.error('Create Campaign Error:', err);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
};

// Get all campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    console.error('Fetch Campaigns Error:', err);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};

// Get a campaign by custom campaign_id
exports.getCampaignByCampaignId = async (req, res) => {
  try {
    const { campaign_id } = req.params;
    const campaign = await Campaign.findOne({ campaign_id });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (err) {
    console.error('Get Campaign Error:', err);
    res.status(500).json({ error: 'Failed to retrieve campaign' });
  }
};

// Optional: Update campaign performance metrics
exports.updateCampaignMetrics = async (req, res) => {
  try {
    const { campaign_id } = req.params;
    const { opened, clicked, responded, purchased } = req.body;

    const updated = await Campaign.findOneAndUpdate(
      { campaign_id },
      { $set: { opened, clicked, responded, purchased } },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Update Metrics Error:', err);
    res.status(500).json({ error: 'Failed to update campaign metrics' });
  }
};
