// conn_postgre.js
const { Client } = require("pg");
const { PG_DB, PG_USER, PG_PW, PG_HOST, PG_PORT } = require("./config.js");

const client = new Client({
  host: PG_HOST,
  port: PG_PORT,
  user: PG_USER,
  password: PG_PW,
  database: PG_DB,
});

client.connect()
  .then(() => console.log("✅ Kết nối PostgreSQL thành công!"))
  .catch(err => console.error("❌ Lỗi kết nối:", err.stack));

module.exports = client;
