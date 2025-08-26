const axios = require("axios");
const VectorDB = require("../vector_db");
const Embeddings = require("../embedding");

async function addToCartTool({ name, size, quantity }) {
    const vectorDB = new VectorDB();
    const embedding = new Embeddings();

    try {
        // ép sang string chắc chắn
        const queryText = typeof name === "string" ? name : JSON.stringify(name);
        console.log("Query: " + queryText)

        // Embedding query
        const queryEmbedding = await embedding.encode(queryText);

        // Tìm ID sản phẩm
        const productId = await vectorDB.searchProduct("products", queryEmbedding, 1);
        console.log("Product ID: " + productId)
        if (!productId) {
        return { success: false, message: "Không tìm thấy sản phẩm trong VectorDB." };
        }

        // lấy quantity (nếu có trong input JSON)
        const quantity_format = typeof quantity === "string" ? parseInt(quantity) : parseInt(JSON.stringify(quantity));
        
        const itemId = `${productId}_${size}`;
        
        // gọi API backend để thêm vào giỏ hàng
        const response = await axios.post(
            "http://localhost:4000/api/cart/addtocart",
            {
                itemId: itemId,
                quantity: quantity_format,
            },
            {
                headers: {
                    "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjgyZGJmMzc2MzhiZTQ5YWJlN2E3ZjE3In0sImlhdCI6MTc1NjEzNTk2M30.h0r3ihU9tdfXERgy2B2Dwu0mAizD9wRikqo5YZK5AUg",
                    "Content-Type": "application/json",
                },
            }
        );

        return {
            success: true,
            message: `✅ Đã thêm ${quantity} sản phẩm (${productId}) vào giỏ hàng.`,
            data: response.data,
        };
    } catch (err) {
    console.error("❌ Lỗi trong addToCartTool:", err);
    return { success: false, message: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng." };
  }
}

module.exports = addToCartTool;