const dotenv = require("dotenv");
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const CHROMA_PATH = process.env.CHROMA_PATH;
const CHROMA_COLLECTION = process.env.CHROMA_COLLECTION;
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL;

module.exports = {
  MONGO_URI,
  DB_NAME,
  COLLECTION_NAME,
  OPENAI_API_KEY,
  CHROMA_PATH,
  CHROMA_COLLECTION,
  EMBEDDING_MODEL,
};
