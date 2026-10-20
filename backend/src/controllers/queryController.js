const db = require('../db');
const { embed } = require('../services/embedder');
const OpenAI = require('openai');

const chat = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

async function handleQuery(req, res, next) {
  try {
    const { question } = req.body;
    if (!question || !question.trim())
      return res.status(400).json({ error: { code: 'EMPTY_QUESTION', message: 'question required' } });

    const [qVec] = await embed([question]);
    
    // Use 'AND k = 5' for sqlite-vec KNN queries
    const hits = db.prepare(`
      SELECT cv.chunk_id, cv.distance, c.content, c.item_id, i.type, i.source
      FROM chunk_vectors cv
      JOIN chunks c ON c.id = cv.chunk_id
      JOIN items i ON i.id = c.item_id
      WHERE cv.embedding MATCH ? AND k = 5
    `).all(new Float32Array(qVec));

    const context = hits
      .map((h, i) => `[${i + 1}] (source: ${h.source || h.type})\n${h.content}`)
      .join('\n\n---\n\n');

    const completion = await chat.chat.completions.create({
      model: 'openai/gpt-oss-120b', // <--- FIXED: Using an active Groq model
      temperature: 0.2,
      messages: [
        { role: 'system', content: `Answer only using the snippets below. Cite with [number]. If insufficient, say "I cannot answer from saved content."\n\n${context}` },
        { role: 'user', content: question },
      ],
    });

    res.json({
      answer: completion.choices[0].message.content,
      sources: hits.map((h, i) => ({
        index: i + 1,
        snippet: h.content.slice(0, 200),
        source: h.source || h.type,
        item_id: h.item_id,
        distance: h.distance 
      })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleQuery };