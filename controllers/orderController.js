const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getOrders = async (req, res) => {
  try {
    console.log('Fetching orders for user:', req.user.id);
    console.log('User role:', req.user.role);

    const query = req.user.role === 'admin' ? {} : { user: req.user.id };

    const orders = await Order.find(query)
      .populate('items.product')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    console.log(`Found ${orders.length} orders`);

    const transformedOrders = orders.map(order => ({
      _id: order._id,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        product: {
          name: item.product.name,
          price: item.product.price
        },
        quantity: item.quantity
      })),
      total: order.total,
      status: order.status,
      user: req.user.role === 'admin' ? {
        username: order.user.username,
        email: order.user.email
      } : undefined
    }));

    res.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid items array' });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }

      total += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      total,
      shippingAddress: shippingAddress || {
        type: 'Point',
        coordinates: [0, 0]
      },
      status: 'Pending'
    });

    await order.save();
    console.log('New order created:', order._id);

    res.status(201).json({
      message: 'Order created successfully',
      orderId: order._id
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    console.log('Delete request from user:', req.user);

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const isAdmin = req.user.isAdmin || req.user.role === 'admin';
    const isOwner = order.user.toString() === req.user.id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Order.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      message: 'Error deleting order',
      error: error.message
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    console.log('Update status request from user:', req.user);

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!['Pending', 'Processing', 'Shipped', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      order: {
        _id: order._id,
        status: order.status,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({
      message: 'Error updating order status',
      error: error.message
    });
  }
};
