const cheerio = require('cheerio');

function extractTextFromHtml(html) {
  const $ = cheerio.load(html);
  return $('body').text().replace(/\s+/g, ' ').trim();
}

module.exports = extractTextFromHtml;
