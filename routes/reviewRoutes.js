const express = require('express');

const isAuth = require('../middleware/authentication');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(isAuth, reviewController.createReview);

router
  .route('/:reviewId')
  .get(reviewController.getSingleReview)
  .patch(isAuth, reviewController.updateReview)
  .delete(isAuth, reviewController.deleteReview);

module.exports = router;
