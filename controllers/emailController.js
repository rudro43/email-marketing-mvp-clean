const emailQueue = require('../bullmq/emailQueue'); // Make sure this path is correct
// File: backend/controllers/emailController.js
const Customer = require('../models/customer');
const Campaign = require('../models/Campaign');
const Email = require('../models/Email');
const openai = require('../utils/openaiClient');
const Template = require('../models/Template');
const CampaignConfig = require('../models/CampaignConfig');
const getCampaignInteractionModel = require('../utils/getCampaignInteractionModel');
const mongoose = require('mongoose');
const axios = require('axios');
const qs = require('qs');
const { sendOutlookEmail } = require('../services/outlookMailer'); // adjust path if needed

 // adjust path if needed



const fs = require('fs').promises;
const path = require('path');

const tokenPath = path.join(__dirname, '../auth/token.json');

async function getAccessTokenFromRefresh() {
  const tokenData = JSON.parse(await fs.readFile(tokenPath, 'utf8'));

  const res = await axios.post(
    `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}/oauth2/v2.0/token`,
    qs.stringify({
      client_id: process.env.MS_CLIENT_ID,
      client_secret: process.env.MS_CLIENT_SECRET,
      refresh_token: tokenData.refresh_token,
      grant_type: 'refresh_token',
      redirect_uri: 'http://localhost:3000/auth/callback',
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  // Save new tokens to disk
  await fs.writeFile(tokenPath, JSON.stringify(res.data, null, 2));
  return res.data.access_token;
}


/*async function sendMailViaGraph(to, subject, htmlContent) {
  const token = await getAccessTokenFromRefresh();

  await axios.post(
    `https://graph.microsoft.com/v1.0/me/sendMail`,
    {
      message: {
        subject: subject,
        body: {
          contentType: 'HTML',
          content: htmlContent,
        },
        toRecipients: [
          {
            emailAddress: { address: to }
          }
        ],
      },
      saveToSentItems: 'true',
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
}*/




function stripHtmlTags(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, "").trim();

}

// 🔹 Generate email content using OpenAI
/*async function generateEmailContent(customer, campaignName) {
  const prompt = `
Generate a personalized marketing email for:
Name: ${customer.name}
Location: ${customer.country}
Product Preferences: ${customer.products.join(', ')}
Frequent Purchase: ${customer.frequent_purchase}
Campaign: ${campaignName}

Use a friendly tone and include a call to action.


`;


  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content;
}*/
// 🔹 4. Send all generated emails for a campaign

/*exports.sendCampaignEmails = async (req, res) => {
  const { campaign_id } = req.params;

  try {
    const campaignDb = mongoose.connection.useDb('CAMPAIGNS');
    const interactionCollection = campaignDb.collection(campaign_id);
    const emails = await interactionCollection.find({}).toArray();

    if (emails.length === 0) {
      return res.status(404).json({ error: 'No emails found in CAMPAIGNS DB' });
    }

    let scheduled = 0;
    const failed = [];

    for (const email of emails) {
      try {
        if (!email.customer_email || !email.email_preview) continue;

        await emailQueue.add(
          'send-email',
          {
            to: email.customer_email,
            subject: `🔔 ${campaign_id} Campaign`,
            html: email.email_preview,
          },
          {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
          }
        );

        scheduled++;
      } catch (err) {
        failed.push({ to: email.customer_email, error: err.message });
      }
    }

    res.json({
      success: true,
      scheduled,
      failed: failed.length,
      errors: failed,
    });
  } catch (err) {
    console.error('Batch scheduling error:', err);
    res.status(500).json({ error: 'Server error scheduling emails' });
  }
};*/



exports.sendCampaignEmails = async (req, res) => {
  const { campaign_id } = req.params;

  try {
    const campaignDb = mongoose.connection.useDb('CAMPAIGNS');
    const interactionCollection = campaignDb.collection(campaign_id);
    const emails = await interactionCollection.find({}).toArray();

    if (emails.length === 0) {
      return res.status(404).json({ error: 'No emails found in CAMPAIGNS DB' });
    }

    let sent = 0;
    const failed = [];

    for (const email of emails) {
      try {
        if (!email.customer_email || !email.email_preview) continue;

        await sendOutlookEmail(
          email.customer_email,
          `🔔 ${campaign_id} Campaign`,
          email.email_preview
        );

        sent++;
      } catch (err) {
        failed.push({ to: email.customer_email, error: err.message });
      }
    }

    res.json({
      success: true,
      sent,
      failed: failed.length,
      errors: failed,
    });
  } catch (err) {
    console.error('Batch email send error:', err);
    res.status(500).json({ error: 'Server error sending campaign emails' });
  }
};



// 🔹 1. Basic segment-only generation (without campaign logic)
exports.generateBatchBySegment = async (req, res) => {
  const { segment } = req.params;

  try {
    const customers = await Customer.find({ segments: segment });
    const emails = [];

    for (const customer of customers) {
      const email = await generateEmailContent(customer, 'General Campaign');
      emails.push({ customer_id: customer._id, email });

      // Save in Email collection (without campaign_id)
      await Email.create({
        customer_id: customer._id,
        customer_email: customer.email,  // ✅ ADD THIS LINE
        campaign_id: campaign.campaign_id,
        email_content: emailBody,
        rendered_html: emailBody,
            });
    }

    res.json({ emails });
  } catch (err) {
    console.error('Email batch generation failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
};

// 🔹 2. Full campaign + batch email generation
// File: backend/controllers/emailController.js

/*exports.generateEmailsWithCampaign = async (req, res) => {
  const { customers, campaign, filters_applied = [] } = req.body;

  if (!customers || !campaign) {
    return res.status(400).json({ error: 'Missing customers or campaign data' });
  }

  try {
    // Ensure campaign is stored
    let campaignDoc = await Campaign.findOne({ campaign_id: campaign.campaign_id });
    if (!campaignDoc) {
      campaignDoc = new Campaign(campaign);
      await campaignDoc.save();
    }

    // Fetch saved template HTML
    const template = await Template.findOne({ campaign_id: campaign.campaign_id });
    if (!template) {
      return res.status(404).json({ error: 'No template found for this campaign' });
    }

    const extractTextFromHtml = require('../utils/extractText');
    const rawTemplateText = extractTextFromHtml(template.html);

    // Save campaign config metadata
    await CampaignConfig.findOneAndUpdate(
      { campaign_id: campaign.campaign_id },
      {
        $set: {
          filters_applied,
          template_docx_path: `exports/template_${campaign.campaign_id}.docx`,
          created_at: new Date(),
        },
      },
      { upsert: true }
    );

    // Use CAMPAIGNS DB for per-campaign interaction logs
    const campaignDb = mongoose.connection.useDb('CAMPAIGNS');
    const interactionCollection = campaignDb.collection(campaign.campaign_id);

    const emails = [];

    for (const customer of customers) {
     const prompt = `
You are an expert email marketer.

Here's a base HTML email template (including image elements and formatting):
"${template.html}"

Please personalize the *text content only* of this HTML email for:
- Customer Name: ${customer.name}
- Location: ${customer.location || 'N/A'}
- Interests: ${customer.interests || 'N/A'}

Write atleast 50 words in the mail
⚠️ Do not remove or modify any <img> tags or other HTML structure. Just update the wording (greetings, body, CTA) inside the template as appropriate.

Output the full personalized HTML.
`;


      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: prompt }],
      });

     let emailBody = response.choices[0].message.content.trim();

    // Remove code block wrappers like ```html ... ```
      emailBody = emailBody.replace(/^```(?:html)?\s*|```$/g, '');

      const savedEmail = await Email.create({
        customer_id: customer._id,
        campaign_id: campaign.campaign_id,
        email_content: emailBody,
        rendered_html: emailBody,
      });

      // Save interaction metadata in CAMPAIGNS DB
      await interactionCollection.insertOne({
        customer_email: customer.email_id,
        customer_name: customer.name,
        email_preview: emailBody,
        opened: false,
        open_count: 0,
        link_clicked: false,
        click_count: 0,
        scrolled: false,
        last_interaction: null,
        date: new Date(),
      });

      emails.push({
        customer_id: customer._id,
        customer_name: customer.name,
        email: emailBody,
        rendered_html: emailBody,
      });
    }

    res.json({
      message: 'Campaign created and emails generated successfully',
      campaign_id: campaign.campaign_id,
      emails,
    });
  } catch (err) {
    console.error('Email generation with campaign failed:', err);
    res.status(500).json({ error: 'Server error generating emails' });
  }
};*/
// 🔹 3. Get stored emails by campaign ID
exports.getEmailsByCampaign = async (req, res) => {
  try {
    const emails = await Email.find({ campaign_id: req.params.campaign_id });
    res.json(emails);
  } catch (err) {
    console.error('Error fetching emails:', err);
    res.status(500).json({ error: 'Failed to fetch emails for campaign' });
  }
};


   // ⬅️ Make sure to install this: npm install p-limit

exports.generateEmailsWithCampaign = async (req, res) => {
  const { customers, campaign, filters_applied = [] } = req.body;

  if (!customers || !campaign) {
    return res.status(400).json({ error: 'Missing customers or campaign data' });
  }

  try {
    const { default: pLimit } = await import('p-limit');
    // Ensure campaign is stored
    let campaignDoc = await Campaign.findOne({ campaign_id: campaign.campaign_id });
    if (!campaignDoc) {
      campaignDoc = new Campaign(campaign);
      await campaignDoc.save();
    }

    // Fetch saved template HTML
    const template = await Template.findOne({ campaign_id: campaign.campaign_id });
    if (!template) {
      return res.status(404).json({ error: 'No template found for this campaign' });
    }

    const extractTextFromHtml = require('../utils/extractText');
    const rawTemplateText = extractTextFromHtml(template.html);

    // Save campaign config metadata
    await CampaignConfig.findOneAndUpdate(
      { campaign_id: campaign.campaign_id },
      {
        $set: {
          filters_applied,
          template_docx_path: `exports/template_${campaign.campaign_id}.docx`,
          created_at: new Date(),
        },
      },
      { upsert: true }
    );

    // Use CAMPAIGNS DB for per-campaign interaction logs
    const campaignDb = mongoose.connection.useDb('CAMPAIGNS');
    const interactionCollection = campaignDb.collection(campaign.campaign_id);

    const emails = [];
    const limit = pLimit(10); // ⬅️ Limit to 5 concurrent OpenAI calls

    const generationTasks = customers.map((customer) =>
      limit(async () => {
        const prompt = `
You are an expert email marketer.

Here's a base HTML email template (including image elements and formatting):
"${template.html}"

Please personalize the *text content only* of this HTML email for:
- Customer Name: ${customer.name}
- Location: ${customer.location || 'N/A'}
- Interests: ${customer.interests || 'N/A'}

⚠️ Do not remove or modify any <img> tags or other HTML structure. Just update the wording (greetings, body, CTA) inside the template as appropriate.

Output the full personalized HTML.
        `;

        const response = await openai.chat.completions.create({
          model: 'gpt-4.1-mini',
          messages: [{ role: 'user', content: prompt }],
        });

        const emailBody = response.choices[0].message.content.trim();

        // Save to main Email DB
        await Email.create({
          customer_id: customer._id,
          campaign_id: campaign.campaign_id,
          email_content: emailBody,
          rendered_html: emailBody,
        });

        // Save to CAMPAIGNS DB
        await interactionCollection.insertOne({
          customer_email: customer.email_id,
          customer_name: customer.name,
          email_preview: emailBody,
          opened: false,
          open_count: 0,
          link_clicked: false,
          click_count: 0,
          scrolled: false,
          last_interaction: null,
          date: new Date(),
        });

        emails.push({
          customer_id: customer._id,
          customer_name: customer.name,
          email: emailBody,
          rendered_html: emailBody,
        });
      })
    );

    await Promise.all(generationTasks);

    res.json({
      message: '✅ Campaign created and emails generated successfully',
      campaign_id: campaign.campaign_id,
      emails,
    });
  } catch (err) {
    console.error('Email generation with campaign failed:', err);
    res.status(500).json({ error: 'Server error generating emails' });
  }
};
