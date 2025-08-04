// backend/controllers/templateController.js
const Template = require('../models/Template');
const htmlDocx = require('html-docx-js');
const fs = require('fs');
const path = require('path');
const CampaignConfig = require('../models/CampaignConfig');
exports.exportTemplateDocx = async (req, res) => {
  try {
    const { campaign_id } = req.params;
    const template = await Template.findOne({ campaign_id });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const docxBuffer = htmlDocx.asBlob(template.html);

    const fileName = `template_${campaign_id}.docx`;
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(docxBuffer);
  } catch (err) {
    console.error('Failed to export template:', err);
    res.status(500).json({ error: 'Failed to export DOCX' });
  }
};

// Save template

exports.saveTemplate = async (req, res) => {
  const { campaign_id, html } = req.body;
  const outputDir = path.join(__dirname, '..', 'exports');
  const fileName = `template_${campaign_id}.docx`;
  const filePath = path.join(outputDir, fileName);

  try {
    // 1. Save template HTML to DB
    await Template.findOneAndUpdate(
      { campaign_id },
      { campaign_id, html },
      { upsert: true, new: true }
    );

    // 2. Ensure export directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // 3. Convert HTML to DOCX (Blob → ArrayBuffer → Buffer)
    const blob = htmlDocx.asBlob(html);
    const arrayBuffer = await blob.arrayBuffer();
    const docxBuffer = Buffer.from(arrayBuffer);

    // 4. Write .docx file
    fs.writeFileSync(filePath, docxBuffer);

    // 5. Save reference in CampaignConfig
    await CampaignConfig.findOneAndUpdate(
      { campaign_id },
      { $set: { template_docx_path: `exports/${fileName}` } },
      { upsert: true }
    );

    res.json({ message: 'Template saved and .docx exported!' });
  } catch (err) {
    console.error('Error saving template or exporting DOCX:', err);
    res.status(500).json({ error: 'Failed to save template and export .docx' });
  }
};


// Get template
// controllers/templateController.js

exports.getTemplateByCampaign = async (req, res) => {
  try {
    const template = await Template.findOne({ campaign_id: req.params.campaignId });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // This is what the frontend expects
    res.json({ html: template.html });
  } catch (err) {
    console.error('Error loading template:', err);
    res.status(500).json({ error: 'Failed to load template' });
  }
};

