const mongoose = require("mongoose");

// Schema creating for Orders model
const Orders = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    cartItems: {
        type: Object, 
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    discountValue: {
        type: Number,
        default: 0
    },
    finalAmount: {
        type: Number,
        required: true
    },
    shippingInfo: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: ['momo', 'vnpay', 'cod'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'cancelled'],
        default: 'processing'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Orders', Orders);