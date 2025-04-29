const Orders = require('../models/Order');
const Users = require('../models/User');

const allOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const totalOrders = await Orders.countDocuments();

        const orders = await Orders.find({})
            .skip(skip)
            .limit(limit);

        console.log("Orders Fetched with Pagination");

        res.send({
            totalOrders,          // tổng số đơn
            totalPages: Math.ceil(totalOrders / limit),  // tổng số trang
            currentPage: page,     // trang hiện tại
            orders,                // danh sách đơn hàng
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
}

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

//lay ra order trang client
const userOrders = async (req, res) => {
    console.log("User from token:", req.user);
    const userId = req.user.id; // từ token
    const orders = await Orders.find({
        userId
    });
    res.json(orders);
}

module.exports = {
    placeOrder,
    allOrders,
    updateOrderStatus,
    userOrders,
    removeOrder
};