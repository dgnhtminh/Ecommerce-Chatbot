const dotenv = require("dotenv");
dotenv.config();

// MongoDB
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

// OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Chroma
const CHROMA_PATH = process.env.CHROMA_PATH;
const CHROMA_COLLECTION = process.env.CHROMA_COLLECTION;
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL;

// PostgreSQL
const PG_DB = process.env.PG_DB;
const PG_USER = process.env.PG_USER;
const PG_PW = process.env.PG_PW ? String(process.env.PG_PW) : undefined;
const PG_HOST = process.env.PG_HOST || "localhost";
const PG_PORT = process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432;

module.exports = {
  // Mongo
  MONGO_URI,
  DB_NAME,
  COLLECTION_NAME,

  // OpenAI
  OPENAI_API_KEY,

  // Chroma
  CHROMA_PATH,
  CHROMA_COLLECTION,
  EMBEDDING_MODEL,

  // PostgreSQL
  PG_DB,
  PG_USER,
  PG_PW,
  PG_HOST,
  PG_PORT,
};
