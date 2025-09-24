const Embeddings = require("./embedding.js");
const VectorDB = require("./vector_db.js");
const { getProducts } = require("./mongo_utils.js");
const { router } = require("./routerChatbot.js"); 
const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { ChatOpenAI } = require("@langchain/openai");
const client = require("./conn_postgre.js");
const { DynamicTool } = require("@langchain/core/tools");
const checkStockTool = require("./tools/checkStockTool.js");
const addToCartTool = require("./tools/addToCartTool.js");
const checkOrdersTool  = require("./tools/checkOrdersTool.js");

const systemPrompt = `Bạn là một nhân viên tư vấn bán quần áo chuyên nghiệp tại cửa hàng Fashion.
Xưng em và xưng khách hàng là anh/chị. Nhiệm vụ của bạn là trả lời câu hỏi của khách hàng một cách rõ ràng, thân thiện và dựa hoàn vào các thông tin sản phẩm được cung cấp bên dưới.
Chỉ sử dụng thông tin có trong dữ liệu. Không tự tạo ra thông tin nếu không được cung cấp.
Nếu không tìm thấy câu trả lời, hãy lịch sự trả lời rằng hiện tại bạn chưa có đủ thông tin để tư vấn chính xác.
Hãy ưu tiên ngắn gọn, dễ hiểu. Nếu khách hỏi gợi ý sản phẩm, hãy liệt kê một vài mẫu phù hợp và lý do tại sao nên chọn.
Luôn giữ thái độ lịch sự, chuyên nghiệp và hỗ trợ hết mình.
Lưu ý: Tên sản phẩm phải giữ nguyên`;

// RAG 
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

    const res = await client.query("SELECT * FROM products");
    const products = res.rows;

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

//  SQL 
async function runSQLQuery(query) {
  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  });

  const systemMsg = {
    role: "system",
    content: `
    Bạn là chuyên gia SQL. Nhiệm vụ: sinh ra câu lệnh SQL phù hợp để chạy trên bảng **products** trong PostgreSQL.
    Cấu trúc bảng products:
    - id (INT, PRIMARY KEY)
    - name (TEXT)
    - description (TEXT)
    - category (TEXT)
    - new_price (NUMERIC)
    - old_price (NUMERIC)
    - sizes (TEXT[])

    Lưu ý:
    - Bảng category là men, women, kid.

    Nguyên tắc:
    - Chỉ sinh ra **câu lệnh SQL hợp lệ** (không giải thích).
    - Luôn SELECT, không DROP/DELETE/UPDATE.
    Ví dụ:
    - "Sản phẩm đắt nhất" -> SELECT name, new_price FROM products ORDER BY new_price DESC LIMIT 1;
    - "Giá trung bình áo sơ mi" -> SELECT AVG(new_price) FROM products WHERE category ILIKE '%women%';
    - "5 sản phẩm rẻ nhất" -> SELECT name, new_price FROM products ORDER BY new_price ASC LIMIT 5;
    `,
  };

  const response = await llm.invoke([systemMsg, { role: "user", content: query }]);
  const sql = response.content.trim();
  console.log("📝 SQL generated:", sql);

  try {
    const res = await client.query(sql);

    if (res.rows.length === 0) {
      return "Em không tìm thấy sản phẩm nào phù hợp với yêu cầu này ạ.";
    }

    const context = JSON.stringify(res.rows, null, 2);

    const systemContent = systemPrompt + (context ? `\nDữ liệu sản phẩm liên quan:\n${context}` : "");

    const tempMessages = [
      { role: "system", content: systemContent },
      { role: "user", content: query },
    ];

  const chatResponse = await llm.invoke([
    { role: "system", content: systemContent },
    { role: "user", content: query },
  ]);

  return chatResponse.content.trim();
  } catch (err) {
    return `❌ SQL query failed\nChi tiết: ${err.message}\nSQL: ${sql}`;
  }
}

// Agent
async function runAgent(query) {
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
    new DynamicTool({
      name: "add_to_cart",
      description: `Thêm sản phẩm vào giỏ hàng của người dùng.
        Input phải là JSON object với các field:
        - name: Tên sản phẩm
        - size: Kích thước sản phẩm
        - quantity: Số lượng sản phẩm`,
      func: async(input) => {
        try {
          const { name, size, quantity } = JSON.parse(input)
          // Gọi tool gốc
          const result = await addToCartTool({ name: name, size: size, quantity: quantity });
          return JSON.stringify(result);
        } catch (err) {
          return JSON.stringify({
               error: "Invalid input format",
              detail: err.message,
          });
        }
      }
    }),
    new DynamicTool({
      name: "check_orders",
      description: `Kiểm tra trạng thái đơn hàng của người dùng theo từng ngày.
      Input phải là JSON object:
      - date: ngày muốn kiểm tra có dạng YYYY-MM-DD.`,
      func: async (input) => {
        try{
          let finalInput;
          
          if (typeof input === 'string') {
            const parsed = JSON.parse(input);
            console.log("📦 First parse result:", parsed);
            
            // LangChain wraps input in {"input": "..."} format
            if (parsed.input) {
              finalInput = typeof parsed.input === 'string' ? JSON.parse(parsed.input) : parsed.input;
            } else {
              finalInput = parsed;
            }
          } else {
            finalInput = input;
          }
          const result = await checkOrdersTool(finalInput);
          return JSON.stringify(result)
        } catch (err) {
          return JSON.stringify({
              error: "Invalid input format",
              detail: err.message,
          });
        }
      }
    })
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "zero-shot-react-description",
    verbose: true,
  });

  // console.log("Expected input variables:", executor.agent.llmChain.prompt.inputVariables);

  // Ghép tin nhắn lịch sử thành context cho agent
  // const chat_history = messages.map(m => `${m.role}: ${m.content}`).join("\n");

  const result = await executor.invoke({
    input: query,
    // chat_history, // truyền history ở dạng text
  });

  console.log(result)
  return result.output;
}

// CHITCHAT 
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
  console.log("Intent: ", intent);

  if (intent === "RAG") {
    return await askQuestion(query, messages);
  } else if (intent === "SQL") {
    return await runSQLQuery(query);
  } else if (intent === "AGENT") {
    return await runAgent(query);
  } else {
    return await chitChat(query, messages);
  }
}

module.exports = { handleUserQuery, askQuestion, runAgent, chitChat };
