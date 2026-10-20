const db = require('../db');
const { chunkText } = require('../services/chunker');
const { embed } = require('../services/embedder');
const { fetchUrlContent } = require('../services/urlFetcher');
const { generateTags } = require('../services/tagger');

async function handleIngest(req, res, next) {
  try {
    const { type, content, url } = req.body;

    if (!['note', 'url'].includes(type))
      return res.status(400).json({ error: { code: 'INVALID_TYPE', message: 'type must be note or url' } });
    if (type === 'note' && (!content || !content.trim()))
      return res.status(400).json({ error: { code: 'EMPTY_CONTENT', message: 'content required' } });
    if (type === 'url' && !url)
      return res.status(400).json({ error: { code: 'MISSING_URL', message: 'url required' } });

    const raw = type === 'url' ? await fetchUrlContent(url) : content;
    
    const [tags, chunks] = await Promise.all([
      generateTags(raw),
      Promise.resolve(chunkText(raw))
    ]);
    
    const vectors = await embed(chunks);

    const insertItem = db.prepare('INSERT INTO items (type, source, raw_content, tags) VALUES (?,?,?,?)');
    const insertChunk = db.prepare('INSERT INTO chunks (item_id, chunk_index, content) VALUES (?,?,?)');
    const insertVec = db.prepare('INSERT INTO chunk_vectors (chunk_id, embedding) VALUES (?,?)');

    const tx = db.transaction(() => {
      // Normal integer for the items table
      const info = insertItem.run(type, url || null, raw, JSON.stringify(tags));
      const itemId = Number(info.lastInsertRowid); 

      chunks.forEach((c, i) => {
        const cInfo = insertChunk.run(itemId, i, c);
        
        // FORCE BigInt for the vector table primary key
        const chunkId = BigInt(cInfo.lastInsertRowid); 
        
        insertVec.run(chunkId, new Float32Array(vectors[i]));
      });
      return itemId;
    });

    const itemId = tx();
    res.status(201).json({ item: { id: itemId, chunks: chunks.length, tags } });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleIngest };