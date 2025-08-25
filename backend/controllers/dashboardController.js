const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

const stats =  async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    const shippedOrders = await Order.find({ status: 'delivered' });
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

const getMonthlyRevenue = async (req, res) => {
  try {
    const revenueByMonth = await Order.aggregate([
      {
        $match: { status: 'delivered' } 
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { _id: 1 } 
      }
    ]);

    const formattedData = Array.from({ length: 12 }, (_, i) => {
      const found = revenueByMonth.find(r => r._id === i + 1);
      return {
        month: `Month ${i + 1}`,
        revenue: found ? found.total : 0
      };
    });

    res.json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get monthly revenue' });
  }
};

module.exports = { stats, getMonthlyRevenue };