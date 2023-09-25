const path = require('path');

const { v4: uuidv4 } = require('uuid');

const Product = require('../models/Product');
const { collectValidationResult } = require('../utils');
const throwCustomError = require('../errors/custom-error');

exports.getAllProducts = async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({ products, count: products.length });
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
  const { productId } = req.params;
  const product = await Product.findById(productId).populate('reviews'); // we're using a virtual field here [not defined in schema]
  if (!product) {
    throwCustomError(`Could not find a product with ID: ${productId}`, 404);
  }
  res.status(200).json({ product });
};

exports.updateProduct = async (req, res, next) => {
  collectValidationResult(req);
  const {
    params: { productId },
    user: { userId },
    body,
  } = req;
  const product = await Product.findById(productId);
  if (!product) {
    throwCustomError(`Could not find a product with ID: ${productId}`, 404);
  }
  if (!product.user.equals(userId)) {
    throwCustomError(
      'Unauthorized! only the admin who created this product can update it',
      403
    );
  }
  updatedProduct = await product.updateOne(body, {
    new: true,
    runValidators: true,
  });
  // for (const prop in body) {
  //   product[prop] = body[prop];
  // }
  // const updatedProduct = await product.save();
  res.status(200).json({ updatedProduct });
};

exports.deleteProduct = async (req, res, next) => {
  const {
    params: { productId },
    user: { userId },
  } = req;
  const product = await Product.findById(productId);
  if (!product) {
    throwCustomError(`Could not find a product with ID: ${productId}`, 404);
  }
  if (!product.user.equals(userId)) {
    throwCustomError(
      'Unauthorized! only the admin who created this product can delete it',
      403
    );
  }
  await product.deleteOne();
  res.status(200).json({ message: 'Successfully deleted product' });
};

exports.uploadProductImage = async (req, res, next) => {
  if (!req.files) {
    throwCustomError('No file uploaded', 400);
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith('image')) {
    throwCustomError('Please upload an image', 400);
  }
  const maxSize = 1024 * 1024; // 1MB
  if (productImage.size > maxSize) {
    throwCustomError('Please upload an image smaller than 1MB', 400);
  }
  const imageName = uuidv4() + '-' + productImage.name;
  await productImage.mv(
    path.join(__dirname, '..', 'public', 'uploads', imageName)
  );
  res.status(200).json({ img: `uploads/${imageName}` });
};
