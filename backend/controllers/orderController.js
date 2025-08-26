const Orders = require('../models/Order');
const Users = require('../models/User');

const allOrders = async (req, res) => {
    try {
        const { page = 1, limit = 5, search = '' } = req.query;

        const query = search
            ? {
                $or: [
                    { 'shippingInfo.fullName': { $regex: search, $options: 'i' } },
                    { 'shippingInfo.email': { $regex: search, $options: 'i' } }
                ]
              }
            : {};

        const total = await Orders.countDocuments(query);
        const orders = await Orders.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({
            orders,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error("Error in allOrders:", err);
        res.status(500).json({ message: "Server Error" });
    }
};



const removeOrder = async (req, res) => {
    await Orders.findByIdAndDelete(req.body.id);
    console.log("Removed");
    res.json({
        success: true,
    })
}

const placeOrder = async (req, res) => {
    try {
        const {
            shippingInfo,
            paymentMethod,
            discountValue,
            totalAmount,
            finalAmount
        } = req.body;

        // Lấy cartData từ user
        const user = await Users.findById(req.user.id);
        const cartItems = user.cartData;

        // Nếu giỏ hàng rỗng thì không cho đặt hàng
        if (!cartItems || Object.keys(cartItems).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Giỏ hàng trống'
            });
        }

        const newOrder = new Orders({
            userId: user._id,
            cartItems,
            totalAmount,
            discountValue: discountValue || 0,
            finalAmount,
            shippingInfo,
            paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        });

        await newOrder.save();

        // Xóa giỏ hàng sau khi đặt hàng thành công
        user.cartData = {};
        await user.save();

        res.json({
            success: true,
            message: 'Đặt hàng thành công',
            orderId: newOrder._id
        });

    } catch (err) {
        console.error("Place Order Error:", err);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi đặt hàng'
        });
    }
}

const updateOrderStatus = async (req, res) => {
    const {
        id,
        status
    } = req.body;
    try {
        await Orders.findByIdAndUpdate(id, {
            status
        });
        res.json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Update failed',
            error: err
        });
    }
}

const userOrders = async (req, res) => {
    console.log("User from token:", req.user);
    const userId = req.user.id; // từ token
    const orders = await Orders.find({
        userId
    });
    res.json(orders);
}

const cancelOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Orders.findOne({ _id: orderId, userId: req.user.id });
        if (!order) return res.status(404).send("Order not found");

        if (order.status !== "processing") {
            return res.status(400).send("Only processing orders can be cancelled");
        }

        order.status = "cancelled";
        await order.save();

        res.send("Order cancelled successfully");
    } catch (err) {
        res.status(500).send("Server error");
    }
};

const userOrdersByDate = async (req, res) => {
    try {
        const userId = req.user.id;
        const date = req.query.date;

        if (!date) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng cung cấp ngày (YYYY-MM-DD)" 
            });
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({ 
                success: false, 
                message: "Định dạng ngày không hợp lệ. Vui lòng sử dụng YYYY-MM-DD" 
            });
        }

        // Parse date an toàn hơn - explicit local timezone
        const [year, month, day] = date.split('-').map(Number);
        
        const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
        const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);

        console.log(`Searching orders for userId: ${userId}, date range: ${startDate} - ${endDate}`);

        // Tìm orders theo user và ngày
        const orders = await Orders.find({
            userId,
            createdAt: { $gte: startDate, $lte: endDate }
        });

        console.log(`Found ${orders.length} orders`);

        if (!orders || orders.length === 0) {
            return res.json({ 
                success: true, 
                message: "Không tìm thấy đơn hàng nào trong ngày này.", 
                orders: [] 
            });
        }

        res.json({ success: true, orders });
        
    } catch (err) {
        console.error("Lỗi userOrdersByDate:", err);
        res.status(500).json({ 
            success: false, 
            message: "Đã xảy ra lỗi server",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};


module.exports = {
    placeOrder,
    allOrders,
    updateOrderStatus,
    userOrders,
    removeOrder,
    cancelOrder,
    userOrdersByDate
};