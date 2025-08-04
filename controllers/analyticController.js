// File: backend/controllers/analyticsController.js
const Campaign = require('../models/Campaign');
const Email = require('../models/Email');
const Customer = require('../models/customer');
const Schedule = require('../models/Schedule');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalCampaigns = await Campaign.countDocuments();
    const totalEmails = await Email.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const scheduledCount = await Schedule.countDocuments();

    const campaigns = await Campaign.find();

    // Aggregate performance metrics
    const totalOpened = campaigns.reduce((sum, c) => sum + (c.opened || 0), 0);
    const totalClicked = campaigns.reduce((sum, c) => sum + (c.clicked || 0), 0);
    const totalResponded = campaigns.reduce((sum, c) => sum + (c.responded || 0), 0);
    const totalPurchased = campaigns.reduce((sum, c) => sum + (c.purchased || 0), 0);

    res.json({
      totalCampaigns,
      totalEmails,
      totalCustomers,
      scheduledCount,
      totalOpened,
      totalClicked,
      totalResponded,
      totalPurchased,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
