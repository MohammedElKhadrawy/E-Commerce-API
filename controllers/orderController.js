const Order = require('../models/Order');
const Product = require('../models/Product');
const throwCustomError = require('../errors/custom-error');

// we simulate the stripe behavior
// cuz we don't actually have a front-end yet
const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue';
  return { client_secret, amount };
};

exports.createOrder = async (req, res, next) => {
  const { cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length === 0) {
    throwCustomError('No cart items provided', 400);
  }
  if (!tax || !shippingFee) {
    throwCustomError('Please provide tax and shipping fee', 400);
  }

  const orderItems = [];
  let subtotal = 0;
  // we can't use async/await inside forEach or map callback functions
  for (const item of cartItems) {
    const dbProduct = await Product.findById(item.product);
    if (!dbProduct) {
      throwCustomError(
        `Could not find a product with ID: ${item.product}`,
        404
      );
    }

    if (item.quantity > dbProduct.inventory) {
      throwCustomError('order quantity cannot exceed available inventory', 400);
    }

    const { name, price, image } = dbProduct;
    const singleOrderItem = {
      name,
      price,
      image,
      color: item.color,
      quantity: item.quantity,
      product: item.product,
    };
    // add item to order
    orderItems.push(singleOrderItem);
    // calculate subtotal
    subtotal += item.quantity * price;
  }

  // calculate total
  const total = subtotal + tax + shippingFee;
  // get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total, // this has to be the smallest unit of the selected currency [Ex: cents]
    currency: 'usd',
  });

  const order = await Order.create({
    tax,
    shippingFee,
    orderItems,
    subtotal,
    total,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    user: req.user.userId,
  });

  res.status(201).json({
    order,
    clientSecret: order.clientSecret, // just to make it easier for the front-end to access :P
  });
};

exports.getAllOrders = async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({ orders, count: orders.length });
};

exports.getCurrentUserOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(200).json({ orders, count: orders.length });
};

exports.getSingleOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    throwCustomError(`Could not find an order with ID: ${orderId}`, 404);
  }
  if (!order.user.equals(req.user.userId) && req.user.role !== 'admin') {
    throwCustomError(
      'Unauthorized! only the user who created this order or an admin can access it',
      403
    );
  }
  res.status(200).json({ order });
};

exports.updateOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    throwCustomError(`Could not find an order with ID: ${orderId}`, 404);
  }
  if (!order.user.equals(req.user.userId) && req.user.role !== 'admin') {
    throwCustomError(
      'Unauthorized! only the user who created this order or an admin can update it',
      403
    );
  }
  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();
  res.status(200).json({ updatedOrder: order });
};
