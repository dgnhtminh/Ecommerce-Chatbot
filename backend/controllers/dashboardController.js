const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

const stats =  async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    const shippedOrders = await Order.find({ status: 'shipped' });
    const totalRevenue = shippedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { stats };