const express = require('express');

const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const isAuth = require('../middleware/authentication');
const authorizeRoles = require('../middleware/authorization');
const { validateProductData } = require('../utils');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    [isAuth, authorizeRoles('admin')],
    validateProductData(),
    productController.createProduct
  );

router.post(
  '/uploadImage',
  [isAuth, authorizeRoles('admin')],
  productController.uploadProductImage
);

router
  .route('/:productId')
  .get(productController.getSingleProduct)
  .patch(
    [isAuth, authorizeRoles('admin')],
    validateProductData({ isOptional: true }),
    productController.updateProduct
  )
  .delete([isAuth, authorizeRoles('admin')], productController.deleteProduct);

// we're using reviewController [cuz it's where the Review model logic is]
router.get('/:productId/reviews', reviewController.getSingleProductReviews);

module.exports = router;
