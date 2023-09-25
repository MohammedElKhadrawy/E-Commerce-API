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
    validateProductData(),
    productController.updateProduct
  )
  .delete([isAuth, authorizeRoles('admin')], productController.deleteProduct);

router.get('/:productId/reviews', reviewController.getSingleProductReviews);

module.exports = router;
