const { ChromaClient } = require("chromadb");
const { CHROMA_PATH } = require("./config");

class VectorDB {
  constructor(url = CHROMA_PATH) {
    this.client = new ChromaClient({ path: url });
  }

  async getCollection(collectionName) {
    // ép buộc không dùng default embedding function
    return this.client.getOrCreateCollection({
      name: collectionName,
      embeddingFunction: null,  // 👈 quan trọng
    });
  }

  async insertDocument(collectionName, document) {
    const collection = await this.getCollection(collectionName);
    await collection.add({
      ids: [document.id],
      documents: [document.information],
      embeddings: [document.embedding], // encode sẵn bằng OpenAI
    });
  }

  async query(collectionName, queryVector, limit = 5) {
    const collection = await this.getCollection(collectionName);
    const results = await collection.query({
      queryEmbeddings: [queryVector],
      nResults: limit,
    });

    const docs = [];
    if (results.ids && results.ids[0]) {
      for (let i = 0; i < results.ids[0].length; i++) {
        docs.push({
          id: results.ids[0][i],
          information: results.documents[0][i],
        });
      }
    }
    return docs;
  }

  async searchProduct(collectionName, queryVector, limit = 1) {
    const collection = await this.getCollection(collectionName);
    const result = await collection.query({
      queryEmbeddings: [queryVector],
      nResults: limit,
    });

    // Lấy id 
    const productId = result.ids[0][0];
    return productId;
  }

  async documentExists(collectionName, filterQuery) {
    try { 
      const collection = await this.getCollection(collectionName);
      const all = await collection.get();
      return all.ids.includes(filterQuery.id);
    } catch (err) {
      console.error("Error checking existence in ChromaDB:", err);
      return false;
    }
  }
}

module.exports = VectorDB;
