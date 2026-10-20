const OpenAI = require('openai');

const chat = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

async function generateTags(text) {
  try {
    const res = await chat.chat.completions.create({
      model: 'openai/gpt-oss-120b', // <--- FIXED: Using an active Groq model
      temperature: 0.1,
      messages: [
        { role: 'system', content: 'Return 3-5 lowercase tags as a JSON array. Only tags, no explanation.' },
        { role: 'user', content: text.slice(0, 2000) },
      ],
    });
    
    // Extract JSON array from response
    const match = res.choices[0].message.content.match(/\[.*\]/s);
    if (match) return JSON.parse(match[0]);
    return [];
  } catch (e) {
    console.error("Tagging failed:", e.message);
    return [];
  }
}

module.exports = { generateTags };