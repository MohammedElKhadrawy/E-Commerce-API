const Product = require('../models/Product');
const { collectValidationResult } = require('../utils');

exports.getAllProducts = async (req, res, next) => {
  res.send('get all products');
};

exports.createProduct = async (req, res, next) => {
  collectValidationResult(req);
  const productData = {
    ...req.body,
    // we HAVE TO explicitly pass the userId, mongoose extracts it from req.user ONLY when creating new instance!
    // - meaning the product.save() approach -
    user: req.user.userId,
  };
  const product = await Product.create(productData);
  res.status(201).json({ product });
};

exports.getSingleProduct = async (req, res, next) => {
  res.send('get single product');
};

exports.updateProduct = async (req, res, next) => {
  res.send('update product');
};

exports.deleteProduct = async (req, res, next) => {
  res.send('delete product');
};

exports.uploadProductImage = async (req, res, next) => {
  res.send('upload product image');
};
