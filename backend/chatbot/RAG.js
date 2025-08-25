const Embeddings = require("./embedding.js");
const VectorDB = require("./vector_db.js");
const { getProducts } = require("./mongo_utils.js");
const { router } = require("./routerChatbot.js"); // router bạn đã viết
const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { ChatOpenAI } = require("@langchain/openai");
const { DynamicTool } = require("@langchain/core/tools");
const checkStockTool = require("./tools/checkStockTool.js");

const systemPrompt = `Bạn là một nhân viên tư vấn bán quần áo chuyên nghiệp tại cửa hàng Fashion.
Xưng em và xưng khách hàng là anh/chị. Nhiệm vụ của bạn là trả lời câu hỏi của khách hàng một cách rõ ràng, thân thiện và dựa hoàn vào các thông tin sản phẩm được cung cấp bên dưới.
Chỉ sử dụng thông tin có trong dữ liệu. Không tự tạo ra thông tin nếu không được cung cấp.
Nếu không tìm thấy câu trả lời, hãy lịch sự trả lời rằng hiện tại bạn chưa có đủ thông tin để tư vấn chính xác.
Hãy ưu tiên ngắn gọn, dễ hiểu. Nếu khách hỏi gợi ý sản phẩm, hãy liệt kê một vài mẫu phù hợp và lý do tại sao nên chọn.
Luôn giữ thái độ lịch sự, chuyên nghiệp và hỗ trợ hết mình.`;

// ------------------ RAG ------------------
async function buildInformation(product) {
  return (
    `Tên sản phẩm: ${product.name || ""}\n` +
    `Mô tả: ${product.description || ""}\n` +
    `Loại: ${product.category || ""}\n` +
    `Giá mới: ${product.new_price || ""}\n` +
    `Giá cũ: ${product.old_price || ""}\n` +
    `Kích cỡ: ${(product.sizes || []).join(", ")}\n`
  );
}

let vectorDB, embedding;
async function initRAG() {
  if (!vectorDB || !embedding) {
    vectorDB = new VectorDB();
    embedding = new Embeddings();

    const products = await getProducts();
    for (const product of products) {
      const id = String(product.id);
      const exists = await vectorDB.documentExists("products", { id });
      if (!exists) {
        const doc = await buildInformation(product);
        const emb = await embedding.encode(doc);
        await vectorDB.insertDocument("products", {
          information: doc,
          embedding: emb,
          id,
        });
      }
    }

    console.log(`RAG init xong ✅`);
  }
}

async function askQuestion(query, messages = []) {
  await initRAG();

  const queryEmbedding = await embedding.encode(query);
  const results = await vectorDB.query("products", queryEmbedding, 5);

  let context = "";
  for (const result of results) {
    context += result.information + "\n";
  }

  const systemContent =
    systemPrompt + (context ? `\nDữ liệu sản phẩm liên quan:\n${context}` : "");

  const tempMessages = [
    { role: "system", content: systemContent },
    ...messages,
    { role: "user", content: query },
  ];

  const response = await embedding.client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: tempMessages,
  });

  return response.choices[0].message.content.trim();
}

// ------------------ AGENT ------------------
async function runAgent(query, messages = []) {
  const llm = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
  });

  const tools = [
    new DynamicTool({
      name: "check_stock",
      description: `Kiểm tra tồn kho sản phẩm trong cửa hàng quần áo.`,
      func: async (input) => {
        try {
          let finalInput;

          if (typeof input === "string") {
            try {
              const parsed = JSON.parse(input);
              finalInput = parsed.input || parsed.query || input;
            } catch {
              finalInput = input;
            }
          } else if (typeof input === "object" && input !== null) {
            finalInput = input.input || input.query;
          }

          if (!finalInput) {
            return JSON.stringify({ error: "Input is missing." });
          }

          // Gọi tool gốc
          const result = await checkStockTool({ input: finalInput });
          return JSON.stringify(result);
        } catch (err) {
          return JSON.stringify({
            error: "Invalid input format",
            detail: err.message,
          });
        }
      },
    }),
    // TODO: addToCart, cancelOrder, placeOrder, checkOrderStatus...
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "zero-shot-react-description",
    verbose: true,
  });

  // console.log("Expected input variables:", executor.agent.llmChain.prompt.inputVariables);

  // Ghép tin nhắn lịch sử thành context cho agent
  const chat_history = messages.map(m => `${m.role}: ${m.content}`).join("\n");

  const result = await executor.invoke({
    input: query,
    // chat_history, // truyền history ở dạng text
  });

  console.log(result)
  return result.output;
}

// ------------------ CHITCHAT ------------------
async function chitChat(query, messages = []) {
  const llm = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.5,
  });

  const formattedMessages = [
    ...messages,
    { role: "user", content: query }
  ];

  const response = await llm.invoke(formattedMessages);
  return response.content.trim();
}

// ------------------ MAIN HANDLER ------------------
async function handleUserQuery(query, messages = []) {
  const intent = await router(query);

  if (intent === "RAG") {
    return await askQuestion(query, messages);
  } else if (intent === "AGENT") {
    return await runAgent(query);
  } else {
    return await chitChat(query, messages);
  }
}

module.exports = { handleUserQuery, askQuestion, runAgent, chitChat };
