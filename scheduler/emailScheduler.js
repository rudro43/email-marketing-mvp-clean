// File: backend/scheduler/emailScheduler.js
const cron = require('node-cron');
const Schedule = require('../models/Schedule');
const { sendOutlookEmail } = require('../services/outlookMailer');

function startEmailScheduler() {
  cron.schedule('* * * * *', async () => {
    const now = new Date();

    try {
      const pendingEmails = await Schedule.find({
        scheduled_time: { $lte: now },
        status: 'pending'
      });

      for (const email of pendingEmails) {
        try {
          await sendOutlookEmail(email.customer_email, email.email_subject, email.email_html);
          email.status = 'sent';
        } catch (err) {
          console.error(`❌ Failed to send scheduled email to ${email.customer_email}:`, err.response?.data || err.message);
          email.status = 'failed';
        }

        await email.save();
      }

      if (pendingEmails.length > 0) {
        console.log(`✅ Processed ${pendingEmails.length} scheduled emails`);
      }
    } catch (err) {
      console.error('⛔ Error checking scheduled emails:', err.message);
    }
  });
}

module.exports = startEmailScheduler;
