const Product = require("../../models/Product");
const VectorDB = require("../vector_db");
const Embeddings = require("../embedding");

async function checkStockTool({ input }) {
  const vectorDB = new VectorDB();
  const embedding = new Embeddings();

  try {
    // ép sang string chắc chắn
    const queryText = typeof input === "string" ? input : JSON.stringify(input);
    console.log("Query: " + queryText)

    // Embedding query
    const queryEmbedding = await embedding.encode(queryText);

    // Tìm sản phẩm
    const productId = await vectorDB.searchProduct("products", queryEmbedding, 1);
    console.log("Product ID: " + productId)
    if (!productId) {
      return { success: false, message: "Không tìm thấy sản phẩm trong VectorDB." };
    }

    // Lấy sản phẩm từ MongoDB
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return { success: false, message: "Không tìm thấy sản phẩm trong database." };
    }

    // Tạo message
    const stockMsg = product.available
      ? `Sản phẩm ${product.name} còn hàng.`
      : `Sản phẩm ${product.name} hết hàng.`;

    return {
      success: true,
      product: {
        id: product.id,
        name: product.name,
        available: product.available,
      },
      message: stockMsg,
    };
  } catch (err) {
    console.error("❌ Lỗi trong checkStockTool:", err);
    return { success: false, message: "Đã xảy ra lỗi khi kiểm tra tồn kho." };
  }
}

module.exports = checkStockTool;
