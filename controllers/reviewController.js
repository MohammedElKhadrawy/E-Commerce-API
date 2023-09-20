const Product = require('../models/Product');
const Review = require('../models/Review');
const throwCustomError = require('../errors/custom-error');
const { collectValidationResult } = require('../utils');

exports.createReview = async (req, res, next) => {
  collectValidationResult(req);
  const { product: productId } = req.body;
  const isValidProduct = await Product.findById(productId);
  if (!isValidProduct) {
    throwCustomError(`Could not find a product with ID: ${productId}`, 404);
  }
  const reviewData = { ...req.body, user: req.user.userId };
  const review = await Review.create(reviewData);
  res.status(201).json({ review });
};

exports.getAllReviews = async (req, res, next) => {
  const reviews = await Review.find().populate('product', 'name company price');
  res.status(200).json({ reviews, count: reviews.length });
};

exports.getSingleReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throwCustomError(`Could not find a review with ID: ${reviewId}`, 404);
  }
  res.status(200).json({ review });
};

exports.updateReview = async (req, res, next) => {
  collectValidationResult(req);
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throwCustomError(`Could not find a review with ID: ${reviewId}`, 404);
  }
  if (!review.user.equals(req.user.userId)) {
    throwCustomError(
      'Unauthorized, only the user who created this review can update it',
      403
    );
  }
  for (const prop in req.body) {
    if (prop === 'user' || prop === 'product') continue;
    review[prop] = req.body[prop];
  }
  await review.save();
  res.status(200).json({ review });
};

exports.deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throwCustomError(`Could not find a review with ID: ${reviewId}`, 404);
  }
  if (!review.user.equals(req.user.userId)) {
    throwCustomError(
      'Unauthorized, only the user who created this review can delete it',
      403
    );
  }
  await review.deleteOne();
  res.status(200).json({ message: 'Successfully deleted review' });
};
