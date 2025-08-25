// db.js
const { MongoClient } = require("mongodb");
const { MONGO_URI, DB_NAME, COLLECTION_NAME } = require("./config.js");

async function getProducts() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const products = await collection
      .find({}, {
        projection: {
          _id: 0,
          id: 1,
          name: 1,
          description: 1,
          category: 1,
          new_price: 1,
          old_price: 1,
          sizes: 1
        }
      })
      .toArray();

    console.log(`✅ Lấy ${products.length} sản phẩm từ MongoDB`);
    return products;
  } catch (error) {
    console.error("❌ Lỗi khi lấy sản phẩm:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// Xuất theo CommonJS
module.exports = { getProducts };
