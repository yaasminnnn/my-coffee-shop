const Order = require('../models/Order');

exports.getSalesAnalytics = async (req, res, next) => {
  try {
    const analytics = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantity: { $sum: "$items.quantity" },
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          productName: "$productDetails.name",
          totalQuantity: 1,
          totalSales: 1
        }
      }
    ]);

    res.json(analytics);
  } catch (err) {
    next(err);
  }
};
