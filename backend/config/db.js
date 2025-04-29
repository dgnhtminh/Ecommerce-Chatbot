const mongoose = require('mongoose');

// Database Connection With MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://dgnhatminh:Minhduong1608@cluster0.xcoy3.mongodb.net/e-commerce");
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error);
        process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
    }
};


module.exports = connectDB;