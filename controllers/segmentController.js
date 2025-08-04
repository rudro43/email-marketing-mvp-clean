const Segment = require('../models/Segment');
const Customer = require('../models/customer');

exports.getSegmentCustomers = async (req, res) => {
  const segmentId = req.params.id; // this is now the custom `segment` string, like "segment-020"

  try {
    const segment = await Segment.findOne({ segment: segmentId });
    if (!segment) return res.status(404).json({ error: 'Segment not found' });

    // Match customers by that segment name
    const customers = await Customer.find({
      segments: segment.segment
    });

    res.json(customers);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error while fetching customers' });
  }
};
