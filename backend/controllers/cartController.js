const Users = require('../models/User');

const addToCart = async (req, res) => {
    const itemId = req.body.itemId;
    console.log("Added", itemId);

    let userData = await Users.findOne({
        _id: req.user.id
    });

    // Nếu chưa có key thì tạo key mới
    if (!userData.cartData[itemId]) {
        userData.cartData[itemId] = 1;
    } else {
        userData.cartData[itemId] += 1;
    }

    await Users.findOneAndUpdate({
        _id: req.user.id
    }, {
        cartData: userData.cartData
    });

    res.send("Added");
}

const removeFromCart = async (req, res) => {
    const itemId = req.body.itemId;
    console.log("Removed", itemId);

    let userData = await Users.findOne({
        _id: req.user.id
    });

    if (userData.cartData[itemId]) {
        userData.cartData[itemId] -= 1;

        // Nếu hết số lượng thì xóa luôn khỏi object
        if (userData.cartData[itemId] <= 0) {
            delete userData.cartData[itemId];
        }

        await Users.findOneAndUpdate({
            _id: req.user.id
        }, {
            cartData: userData.cartData
        });
    }

    res.send("Removed");
}

const getCart = async (req, res) => {
    console.log("GetCart");
    let userData = await Users.findOne({
        _id: req.user.id
    });
    res.json(userData.cartData); // dạng { "12_M": 2, "15_L": 1 }
}

const clearCart = async (req, res) => {
    try {
        await Users.findByIdAndUpdate(req.user.id, {
            cartData: {}
        });
        console.log("Cart cleared");
        res.json({
            success: true,
            message: 'Giỏ hàng đã được xóa'
        });
    } catch (err) {
        console.error("Lỗi khi xóa giỏ hàng:", err);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ'
        });
    }
}

module.exports = {
    addToCart,
    removeFromCart,
    getCart,
    clearCart
};