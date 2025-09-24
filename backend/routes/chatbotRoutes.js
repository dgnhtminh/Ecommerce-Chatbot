// routes/chatbotRoutes.js
const express = require("express");
const router = express.Router();
const { handleUserQuery } = require("../chatbot/RAG_Agents"); 

// Hàm loại bỏ markdown cơ bản (bold, italic, tiêu đề...)
function stripMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")   // bỏ **bold**
    .replace(/\*(.*?)\*/g, "$1")       // bỏ *italic*
    .replace(/#+\s?(.*)/g, "$1")       // bỏ heading (# H1, ## H2...)
    .replace(/`([^`]+)`/g, "$1")       // bỏ inline code
    .replace(/>\s?(.*)/g, "$1")        // bỏ blockquote
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // bỏ link [text](url)
    .trim();
}

// POST /api/chatbot
router.post("/", async (req, res) => {
  try {
    const { query, history } = req.body; 
    if (!query) {
      return res.status(400).json({ error: "❌ Missing query" });
    }

    let reply = await handleUserQuery(query, history || []);
    reply = stripMarkdown(reply); // loại bỏ markdown trước khi gửi

    res.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error("❌ Chatbot error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
