const htmlDocx = require('html-docx-js');
const fs = require('fs');
const path = require('path');

async function exportHtmlToDocx(html, campaignId) {
  const docxBuffer = htmlDocx.asBlob(html);
  const filePath = path.join(__dirname, `../exports/${campaignId}.docx`);

  fs.writeFileSync(filePath, docxBuffer);

  return {
    path: filePath,
    url: `https://your-storage.com/templates/${campaignId}.docx` // Replace with actual S3 or hosting logic
  };
}

module.exports = exportHtmlToDocx;
