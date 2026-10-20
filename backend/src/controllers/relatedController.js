const db = require('../db');

function handleGetRelated(req, res) {
  const { itemId } = req.params;
  
  const rows = db.prepare(`
    SELECT DISTINCT c2.item_id, i2.source, i2.type,
           MIN(vec_distance_cosine(cv1.embedding, cv2.embedding)) AS distance
    FROM chunk_vectors cv1
    JOIN chunks c1 ON c1.id = cv1.chunk_id
    JOIN chunk_vectors cv2 ON cv2.chunk_id != cv1.chunk_id
    JOIN chunks c2 ON c2.id = cv2.chunk_id
    JOIN items i2 ON i2.id = c2.item_id
    WHERE c1.item_id = ? AND c2.item_id != ?
    GROUP BY c2.item_id
    ORDER BY distance
    LIMIT 5
  `).all(itemId, itemId);
  
  res.json({ related: rows });
}

module.exports = { handleGetRelated };