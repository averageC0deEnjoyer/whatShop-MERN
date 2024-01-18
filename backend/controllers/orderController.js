import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

//@desc     Create new order
//@route    POST /api/orders
//@access   Private
const createNewOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item._id,
        _id: null,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  }
});

//@desc     Get logged in user orders
//@route    GET /api/orders/mine
//@access   Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user_id });
  return res.status(200).json(orders);
});

//@desc     Get order by ID
//@route    GET /api/orders/:id
//@access   Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  // can refactor only the user who has the order can see it
  // and create new controller for Admin to see everything
  // console.log(order);
  // console.log(req.user);
  if (order) {
    return res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('No Order Found');
  }
});

//@desc     Update order isPaid status
//@route    PUT /api/orders/:id/pay
//@access   Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    return res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

//@desc     Update order isDelivered status
//@route    PUT /api/orders/:id/deliver
//@access   Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  return res.send('Update order to delivered');
});

//@desc     Get all orders
//@route    GET /api/orders
//@access   Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  return res.send('Get all orders');
});

export {
  createNewOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
