require("dotenv").config();
const { Client } = require("pg");
const { getProducts } = require("./mongo_utils.js"); // code bạn viết ở trên

// Load biến môi trường từ .env
const { PG_DB, PG_USER, PG_PW, PG_HOST, PG_PORT } = require("./config.js");

// Kết nối PostgreSQL
const pgClient = new Client({
  host: PG_HOST,
  port: PG_PORT,
  user: PG_USER,
  password: PG_PW ? String(PG_PW) : undefined,
  database: PG_DB,
});
console.log("Password =", typeof PG_PW, PG_PW);

async function migrateData() {
  try {
    // 1. Kết nối PostgreSQL
    await pgClient.connect();
    console.log("✅ Kết nối PostgreSQL thành công!");

    // 2. Lấy dữ liệu từ MongoDB
    const products = await getProducts();
    console.log(`🔄 Đang insert ${products.length} sản phẩm vào PostgreSQL...`);

    // 3. Insert từng document vào PostgreSQL
    for (const p of products) {
      const query = `
        INSERT INTO products (id, name, description, category, new_price, old_price, sizes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING; -- tránh trùng id
      `;

      const values = [
        p.id,
        p.name,
        p.description,
        p.category,
        p.new_price,
        p.old_price,
        p.sizes || []
      ];

      await pgClient.query(query, values);
    }

    console.log("🎉 Import dữ liệu MongoDB → PostgreSQL thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi migrate dữ liệu:", err);
  } finally {
    await pgClient.end();
    console.log("🔌 Đã đóng kết nối PostgreSQL.");
  }
}

migrateData();
