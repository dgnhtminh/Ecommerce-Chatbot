const Coupon = require('../models/Coupon');

const validateCoupon = async (req, res) => {
    const {
        code
    } = req.body;

    try {
        const coupon = await Coupon.findOne({
            code: code.toUpperCase()
        });

        if (!coupon || !coupon.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code does not exist or has been disabled'
            });
        }

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code has expired'
            });
        }

        return res.json({
            success: true,
            discount: coupon.discount
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ'
        });
    }
}

const allCoupons = async (req, res) => {
    try {
        const { page = 1, limit = 5, search = '' } = req.query;

        const query = search
            ? {
                  code: { $regex: search, $options: 'i' }
              }
            : {};

        const total = await Coupon.countDocuments(query);
        const coupons = await Coupon.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({
            coupons,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error("Error in allCoupons:", err);
        res.status(500).json({ message: "Server Error" });
    }
};



const addCoupon = async (req, res) => {
    try {
        const {
            code,
            discount,
            expiresAt
        } = req.body;
        const newCoupon = new Coupon({
            code,
            discount,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            isActive: true
        });
        await newCoupon.save();
        console.log("Coupon Added");
        res.json({
            success: true
        });
    } catch (error) {
        console.error("Failed to add coupon:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

const removeCoupon = async (req, res) => {
    await Coupon.findByIdAndDelete(req.body.id);
    console.log("Removed");
    res.json({
        success: true,
    })
}

const getSingleCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;
        const { code, discount, expiresAt, isActive } = req.body;

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            couponId,
            {
                code,
                discount,
                expiresAt,
                isActive
            },
            { new: true } // => trả về bản ghi mới sau khi update
        );

        if (!updatedCoupon) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }

        res.status(200).json({ success: true, data: updatedCoupon });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    validateCoupon,
    allCoupons,
    addCoupon,
    removeCoupon,
    getSingleCoupon,
    updateCoupon
};