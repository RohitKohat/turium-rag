const db = require('../db');

function handleGetItems(req, res) {
  const rows = db.prepare(
    'SELECT id, type, source, tags, substr(raw_content,1,200) AS preview, created_at FROM items ORDER BY created_at DESC'
  ).all();
  res.json({ items: rows });
}

module.exports = { handleGetItems };