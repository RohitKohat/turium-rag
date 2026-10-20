const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function for delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function embed(texts) {
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const BATCH_SIZE = 100;
  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batchTexts = texts.slice(i, i + BATCH_SIZE);
    
    const requests = batchTexts.map((text) => ({
      content: { parts: [{ text }] },
      model: "models/gemini-embedding-001"
    }));

    let retries = 3;
    while (retries > 0) {
      try {
        const result = await model.batchEmbedContents({ requests });
        const batchEmbeddings = result.embeddings.map((e) => e.values);
        allEmbeddings.push(...batchEmbeddings);
        break; // Success! Break out of the retry loop
      } catch (error) {
        if (error.status === 429) {
          retries--;
          console.log(`Rate limit hit (429). Retrying in 30 seconds... (${retries} retries left)`);
          if (retries === 0) throw error; // Give up if no retries left
          await sleep(30000); // Wait 30 seconds before retrying
        } else {
          // If it's a different error, throw it immediately
          throw error;
        }
      }
    }
  }
  
  return allEmbeddings;
}

module.exports = { embed };