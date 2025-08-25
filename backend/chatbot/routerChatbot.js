// router.js
const { ChatOpenAI } = require("@langchain/openai");
const { SystemMessage, HumanMessage } = require("@langchain/core/messages");
const dotenv = require("dotenv");

dotenv.config();

const llm = new ChatOpenAI({
  model: "gpt-4o-mini", // bạn có thể đổi sang gpt-4.1-mini hoặc model khác
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
});

async function router(userInput) {
  const systemMsg = new SystemMessage(
    "Bạn là mô hình phân loại intent của chatbot. Nhiệm vụ của bạn là chọn một trong 3 chủ đề: RAG, AGENT, CHITCHAT."
  );

  const humanMsg = new HumanMessage(`
    **Đây là truy vấn của người dùng:** ${userInput}

    Bạn cần phân loại truy vấn vào một trong 3 nhánh:

    **RAG**:
    - Khi khách hàng hỏi thông tin về sản phẩm (mô tả, giá cả, khuyến mãi, so sánh, gợi ý sản phẩm).
    Ví dụ:
    - Áo hoodie này có những size nào?
    - Tư vấn cho tôi vài mẫu áo sơ mi.
    - Áo thun màu đen giá bao nhiêu?

    **AGENT**:
    - Khi khách hàng yêu cầu thực hiện hành động (kiểm tra tồn kho, thêm giỏ hàng, đặt hàng, hủy đơn hàng, kiểm tra trạng thái đơn hàng).
    Ví dụ:
    - Kiểm tra áo sơ mi còn hàng không?
    - Thêm áo hoodie vào giỏ hàng.
    - Hủy đơn hàng #12345.
    - Cho tôi đặt 1 chiếc áo thun trắng size L.

    **CHITCHAT**:
    - Khi khách hàng chào hỏi, nói chuyện phiếm, hoặc hỏi ngoài phạm vi sản phẩm.
    Ví dụ:
    - Chào shop.
    - Bạn khỏe không?
    - Hôm nay trời đẹp nhỉ?
    - Kể tôi một câu chuyện vui đi.

    **Nguyên tắc trả về**:
    - Chỉ trả về duy nhất một từ: "RAG", "AGENT" hoặc "CHITCHAT".
    - Không giải thích thêm.
  `);

  const response = await llm.invoke([systemMsg, humanMsg]);
  return response.content.trim();
}

module.exports = { router }

