const { Worker } = require('bullmq');
const connection = require('./connection');
const { sendOutlookEmail } = require('../services/outlookMailer');

const worker = new Worker(
  'emailQueue',
  async (job) => {
    const { to, subject, html } = job.data;

    // ✅ Log inside the worker function
    console.log('📤 Sending email with:', {
      to,
      subject,
      html,
    });

    await sendOutlookEmail(to, subject, html);
  },
  {
    connection,
    concurrency: 10,
  }
);

worker.on('completed', (job) => {
  console.log(`✅ Email sent to ${job.data.to}`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Email to ${job.data.to} failed:`, err.response?.data || err.message);
});
