const Users = require('../models/User');
const bcrypt = require("bcrypt");

const removeUser = async(req, res)=>{
    await Users.findByIdAndDelete(req.body.id);
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    })
}

const allUsers = async (req, res) => {
    try {
        const { page = 1, limit = 5, search = '' } = req.query;

        const query = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: 'i' } },
                      { email: { $regex: search, $options: 'i' } }
                  ]
              }
            : {};

        const total = await Users.countDocuments(query);
        const users = await Users.find(query, { password: 0 }) // ẩn password
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({
            users,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error("Error in allUsers:", err);
        res.status(500).json({ message: "Server Error" });
    }
};


const profile = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select('-cartData');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi server khi lấy thông tin người dùng' });
    }
};

const changeProfile = async (req, res) => {
    try {
        const { name, password, email } = req.body; 
        const updatedFields = {};

        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedFields.password = hashedPassword;
        }

        const user = await Users.findByIdAndUpdate(
            req.user.id,
            { $set: updatedFields },
            { new: true }
        ).select('-password');

        res.json({ success: true, user });
    } catch (err) {
        console.error("Update error:", err);
        // Nếu email trùng, Mongoose sẽ báo lỗi unique (code 11000)
        if (err.code === 11000 && err.keyPattern?.email) {
            return res.status(400).json({ error: 'Email đã được sử dụng' });
        }

        res.status(500).json({ error: 'Cập nhật thất bại' });
    }
};



module.exports = {
    removeUser,
    allUsers,
    profile,
    changeProfile
};
