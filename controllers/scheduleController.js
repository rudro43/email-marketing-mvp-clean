
const Schedule = require('../models/Schedule');
//const emailQueue = require('../bullmq/emailQueue');

exports.createSchedule = async (req, res) => {
  try {
   const { campaign_id, customer_email, email_subject, email_html, scheduled_time } = req.body;

    if (!campaign_id || !customer_email || !email_subject || !email_html || !scheduled_time) {
  return res.status(400).json({ error: 'All fields are required' });
}

const schedule = new Schedule({
  campaign_id,
  customer_email,
  email_subject,
  email_html,
  scheduled_time: new Date(scheduled_time),
  status: 'pending',
  created_at: new Date(),
});
    await schedule.save();
    
    res.status(201).json({ message: 'Schedule created', schedule });
  } catch (err) {
    console.error('Create schedule error:', err);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
};

// Get all schedule entries
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ scheduled_time: 1 });
    res.json(schedules);
  } catch (err) {
    console.error('Fetch schedules error:', err);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};


exports.scheduleBulkEmails = async (req, res) => {
  const emails = req.body; // Expecting array of emails

  if (!Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: 'Request body must be a non-empty array of emails' });
  }

  try {
    const formatted = emails.map(email => ({
      campaign_id: email.campaign_id,
      customer_email: email.customer_email,
      email_subject: email.email_subject,
      email_html: email.email_html,
      scheduled_time: new Date(email.send_time),
      status: 'pending',
      created_at: new Date(),
    }));

    await Schedule.insertMany(formatted);

    res.status(201).json({ success: true, message: `${formatted.length} emails scheduled` });
  } catch (err) {
    console.error('Bulk scheduling failed:', err.message);
    res.status(500).json({ error: 'Failed to schedule bulk emails' });
  }
};

/*exports.scheduleBulkEmails = async (req, res) => {
  const { emails } = req.body;

  if (!Array.isArray(emails)) {
    return res.status(400).json({ error: 'Invalid email payload' });
  }

  let scheduledCount = 0;

  for (const e of emails) {
    const delay = new Date(e.send_time).getTime() - Date.now();

    await emailQueue.add(
      'sendEmail',
      {
        to: e.customer_email,
        subject: e.email_subject || 'Marketing Campaign',
        html: e.email_html,
      },
      {
        delay: delay > 0 ? delay : 0,
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    scheduledCount++;
  }

  res.json({ scheduledCount });
};*/