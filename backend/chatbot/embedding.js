// embeddings.js
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("./config.js");

class Embeddings {
  constructor() {
    this.modelName = "text-embedding-3-small";
    this.client = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
  }

  async encode(doc) {
    const response = await this.client.embeddings.create({
      model: this.modelName,
      input: doc,
    });

    return response.data[0].embedding;
  }
}

module.exports = Embeddings;
