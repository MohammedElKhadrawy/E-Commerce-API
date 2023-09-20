const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/authentication');
const reviewController = require('../controllers/reviewController');
const Review = require('../models/Review');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    isAuth,
    [
      body('rating', 'rating must be a number between 1 and 5').isFloat({
        min: 1,
        max: 5,
      }),
      body('title', 'title must be a string less than 100 characters')
        .isString()
        .trim()
        .isLength({ max: 100 }),
      body('comment', 'comment is required').isString().notEmpty(),
      body('product', 'product is required')
        .notEmpty()
        .custom(async (value, { req }) => {
          const existingReview = await Review.findOne({
            product: value,
            user: req.user.userId,
          });
          if (existingReview) {
            throw new Error('already submitted review for this product');
          }
        }),
    ],
    reviewController.createReview
  );

router
  .route('/:reviewId')
  .get(reviewController.getSingleReview)
  .patch(
    isAuth,
    [
      body('rating', 'rating must be a number between 1 and 5')
        .optional()
        .isFloat({
          min: 1,
          max: 5,
        }),
      body('title', 'title must be a string less than 100 characters')
        .optional()
        .isString()
        .trim(),
      body('comment', 'comment is required').optional().isString().notEmpty(),
    ],
    reviewController.updateReview
  )
  .delete(isAuth, reviewController.deleteReview);

module.exports = router;
