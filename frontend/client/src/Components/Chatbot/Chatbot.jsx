import React, { useState } from "react";
import { FaUser, FaRobot } from "react-icons/fa";
import "./Chatbot.css";
import ReactMarkdown from "react-markdown";


function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Xin chào! Em là Anie, trợ lý ảo của Fashion!

      Em có thể giúp anh/chị:
      • Cung cấp thông tin về sản phẩm
      • Kiểm tra sản phẩm tồn kho
      • Thêm sản phẩm vào giỏ hàng
      • Kiểm tra trạng thái đơn hàng theo ngày`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const resetChat = () => {
    setMessages([
      { 
        role: "assistant", 
        text: `Xin chào! Em là Anie, trợ lý ảo của Fashion!

        Em có thể giúp anh/chị:
        • Cung cấp thông tin về sản phẩm
        • Kiểm tra sản phẩm tồn kho
        • Thêm sản phẩm vào giỏ hàng
        • Kiểm tra trạng thái đơn hàng theo ngày` 
      }
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessage = { role: "user", text: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("auth-token");
      if (!token) {
        setMessages(prev => [...prev, { role: "assistant", text: "⚠️ Bạn chưa đăng nhập" }]);
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:4000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify({
          query: input,
          history: updatedMessages.map(m => ({ role: m.role, content: m.text }))
        })
      });

      const data = await res.json();

      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", text: "⚠️ Không nhận được phản hồi" }]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: "assistant", text: "⚠️ Lỗi server" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Bubble khi đóng */}
      {!isOpen && (
        <button className="chatbot-bubble" onClick={toggleChat}>
          💬
        </button>
      )}

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <span>Chatbot Anie</span>
            <div className="chatbot-actions">
              <button onClick={resetChat} title="Reset">🔄</button>
              <button onClick={toggleChat} title="Đóng">❌</button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.role}`}>
                {msg.role === "assistant" ? (
                  <FaRobot className="chat-icon bot-icon" />
                ) : (
                  <FaUser className="chat-icon user-icon" />
                )}
                <div className="chat-bubble chat-text-format">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <FaRobot className="chat-icon bot-icon" />
                <div className="chat-bubble">⏳ Đang soạn trả lời...</div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button onClick={sendMessage} disabled={loading}>
              {loading ? "..." : "Gửi"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;