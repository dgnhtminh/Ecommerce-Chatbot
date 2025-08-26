const axios = require("axios");
const Product = require('../../models/Product');

async function checkOrdersTool(input) {
    try {
        // Lấy date từ input với nhiều cách khác nhau
        let date;
        if (input && typeof input === 'object' && input.date) {
            date = input.date;
            console.log("📅 Found date in input.date:", date);
        } else if (typeof input === 'string') {
            // Nếu input là string, có thể là date trực tiếp
            date = input;
            console.log("📅 Input is string, using as date:", date);
        }
        if (!date) {
            return {
                success: false,
                message: "Vui lòng cung cấp ngày theo định dạng YYYY-MM-DD"
            };
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return {
                success: false,
                message: "Định dạng ngày không hợp lệ. Vui lòng sử dụng YYYY-MM-DD",
                debug: {
                    receivedDate: date
                }
            };
        }

        // Gọi API backend
        const response = await axios.get(
            `http://localhost:4000/api/order/userordersbydate`, {
                params: {
                    date: date
                },
                headers: {
                    "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjgyZGJmMzc2MzhiZTQ5YWJlN2E3ZjE3In0sImlhdCI6MTc1NjEzNTk2M30.h0r3ihU9tdfXERgy2B2Dwu0mAizD9wRikqo5YZK5AUg",
                    "Content-Type": "application/json",
                },
            }
        );

        const data = response.data;

        if (!data.success || !data.orders || data.orders.length === 0) {
            return {
                success: true,
                message: `Không tìm thấy đơn hàng nào vào ngày ${date}`
            };
        }

        // Chuyển thông tin đơn hàng thành câu trả lời
        const ordersSummary = await Promise.all(data.orders.map(async (order, idx) => {
            const items = [];

            for (const [key, quantity] of Object.entries(order.cartItems)) {
                const [productId, size] = key.split("_");
                const product = await Product.findOne({ id: productId }); // lấy tên sản phẩm
                if (product) {
                    items.push(`${product.name} (Size: ${size}) x Số lượng: ${quantity}`);
                }
            }

            return `${idx + 1}. Đơn hàng: ${items.join(", ")}, Tổng: $${order.finalAmount}, Trạng thái: ${order.status}, Thanh toán: ${order.paymentStatus}`;
        }));

        return {
            success: true,
            message: `Đơn hàng của bạn vào ngày ${date}: ${ordersSummary}`,
        };
    } catch (err) {
        console.error("❌ Lỗi trong checkOrdersTool:", err);
        return {
            success: false,
            message: "Đã xảy ra lỗi khi lấy đơn hàng"
        };
    }
}

module.exports = checkOrdersTool