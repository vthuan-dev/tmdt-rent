import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js'; // Import model sản phẩm

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Check if there are order items
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('Không có sản phẩm đơn hàng');
    return;
  } else {
    // Check and update stock before creating order
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Không tìm thấy sản phẩm với ID: ${item.product}`);
      }
      if (product.countInStock < item.qty) {
        throw new Error(`Sản phẩm ${product.name} không đủ hàng`);
      }
      product.countInStock -= item.qty; // Giảm tồn kho
      await product.save();
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Save new order to the database
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Kiểm tra payment result
    if (!req.body.id || !req.body.status || !req.body.payer) {
      return res.status(400).json({
        message: 'Thông tin thanh toán không hợp lệ'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    console.log('Payment successful:', updatedOrder);
    res.json(updatedOrder);
    
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      message: 'Lỗi cập nhật thanh toán',
      error: error.message 
    });
  }
});

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};
