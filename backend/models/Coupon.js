const mongoose = require("mongoose");

// Schema creating for Coupon model
const Coupon = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discount: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: Date,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Coupon', Coupon);