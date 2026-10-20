const SIZE = 900;
const OVERLAP = 150;

function chunkText(text) {
  const out = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + SIZE, text.length);
    out.push(text.slice(start, end).trim());
    if (end === text.length) break;
    start = end - OVERLAP;
  }
  return out.filter(c => c.length > 20);
}

module.exports = { chunkText };