// routes/chatbotRoutes.js
const express = require("express");
const router = express.Router();
const { handleUserQuery } = require("../chatbot/RAG_Agents"); 

// POST /api/chatbot
router.post("/", async (req, res) => {
  try {
    const { query, history } = req.body; // history = [{role, content}, ...]
    if (!query) {
      return res.status(400).json({ error: "❌ Missing query" });
    }

    const reply = await handleUserQuery(query, history || []);

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
