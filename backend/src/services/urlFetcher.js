const cheerio = require('cheerio');

async function fetchUrlContent(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TuriumRAG/1.0)' },
    signal: AbortSignal.timeout(10000),
  });
  
  if (!res.ok) {
    const err = new Error(`Fetch failed: ${res.status}`);
    err.status = 422;
    err.code = 'URL_FETCH_FAILED';
    throw err;
  }
  
  const html = await res.text();
  const $ = cheerio.load(html);
  $('script,style,nav,footer,header').remove();
  return $('body').text().replace(/\s+/g, ' ').trim();
}

module.exports = { fetchUrlContent };