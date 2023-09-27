const Order = require('../models/Order');

exports.createOrder = async (req, res, next) => {
  res.send('create order');
};

exports.getAllOrders = async (req, res, next) => {
  res.send('get all orders');
};

exports.getCurrentUserOrders = async (req, res, next) => {
  res.send('get current user orders');
};

exports.getSingleOrder = async (req, res, next) => {
  res.send('get single order');
};

exports.updateOrder = async (req, res, next) => {
  res.send('update order');
};
