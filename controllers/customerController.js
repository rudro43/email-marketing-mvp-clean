const Customer = require('../models/customer');

exports.filterCustomers = async (req, res) => {
  const conditions = req.body.conditions || [];

  try {
    const mongoQuery = buildNestedQuery(conditions);
    const customers = await Customer.find(mongoQuery);
    res.json(customers);
  } catch (err) {
    console.error('Error filtering customers:', err);
    res.status(500).json({ error: 'Failed to filter customers' });
  }
};

// Group conditions by logic and convert to MongoDB $and/$or
function buildNestedQuery(conditions) {
  if (conditions.length === 0) return {};

  let currentGroup = [];
  const queryBlocks = [];

  for (let i = 0; i < conditions.length; i++) {
    const { field, value, logic } = conditions[i];
    if (!field || !value) continue;

    const condition = {
      [field]: { $regex: value, $options: 'i' }
    };

    currentGroup.push(condition);

    const isLast = i === conditions.length - 1;
    const nextLogic = isLast ? null : conditions[i + 1].logic;

    if (logic === 'or' && nextLogic !== 'or') {
      queryBlocks.push({ $or: currentGroup });
      currentGroup = [];
    }

    if (logic === 'and' && nextLogic !== 'or') {
      queryBlocks.push(...currentGroup);
      currentGroup = [];
    }
  }

  // Flush any remaining group
  if (currentGroup.length > 0) {
    queryBlocks.push(...currentGroup);
  }

  return queryBlocks.length === 1 ? queryBlocks[0] : { $and: queryBlocks };
}
