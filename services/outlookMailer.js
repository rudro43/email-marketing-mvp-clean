const axios = require('axios');
const { getAccessToken } = require('./outlookAuth');

async function sendOutlookEmail(to, subject, content) {
  const token = await getAccessToken();

  // 🔍 Validate required fields
  if (!to || !subject || !content) {
    console.warn('⚠️ Missing required email fields:', { to, subject, content });
    throw new Error('Missing required fields for sending email');
  }

  const emailData = {
    message: {
      subject: subject,
      body: {
        contentType: 'HTML', // You can use 'Text' or 'HTML'
        content: content,
      },
      toRecipients: [
        {
          emailAddress: {
            address: to,
          },
        },
      ],
    },
    saveToSentItems: true,
  };

  try {
    await axios.post('https://graph.microsoft.com/v1.0/me/sendMail', emailData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error.response?.data || error.message);
    throw error;
  }
}

module.exports = { sendOutlookEmail };
