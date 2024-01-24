import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calculatePrices } from '../utils/calculatePrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

//@desc     Create new order
//@route    POST /api/orders
//@access   Private
const createNewOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  console.log(orderItems);
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    //we fetch the item from DB to take the price prop for each item
    //so even if the user tamper the data from client, the calculation of the price will be done at server
    const itemsFromDB = await Product.find({
      //mongoDB $in expect an array
      //
      _id: { $in: orderItems.map((item) => item._id) },
    });
    console.log(itemsFromDB);
    //iterate for every item in an order, attach price from backend.
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find((itemFromDB) =>
        itemFromDB._id.equals(itemFromClient._id)
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: null,
      };
    });
    console.log(dbOrderItems);

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calculatePrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    const createdOrder = await order.save();
    // also update the product countInStock
    // fetch all products that is sold
    const products = await Product.find({
      _id: {
        $in: order.orderItems.map((item) => item.product),
      },
    });
    //then we mutate each sold product
    //this one maybe can be done concurrently
    products.forEach(async (product) => {
      //match the item
      const itemSold = order.orderItems.find((item) =>
        item.product.equals(product._id)
      );
      //update the product.countInStock
      product.countInStock =
        Number(product.countInStock) - Number(itemSold.qty);
      await product.save();
    });
    return res.status(201).json(createdOrder);
  }
});

//@desc     Get logged in user orders
//@route    GET /api/orders/mine
//@access   Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
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
  console.log(req.body);
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error('Payment not verified');

  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error('Transaction has been used before');

  const order = await Order.findById(req.params.id);

  if (order) {
    // check the correct amount was paid
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});
//@desc     Update order isDelivered status
//@route    PUT /api/orders/:id/deliver
//@access   Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params;
  //find order
  const order = await Order.findById(orderId);
  if (order) {
    //update the prop
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    //save the updated data
    const updatedOrder = order.save();

    return res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

//@desc     Get all orders
//@route    GET /api/orders
//@access   Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');

  if (orders) {
    return res.status(200).json(orders);
  } else {
    res.status(404);
    throw new Error('No Order yet');
  }
});

export {
  createNewOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
