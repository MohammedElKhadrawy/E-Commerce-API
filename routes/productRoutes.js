const express = require('express');

const productController = require('../controllers/ProductController');
const isAuth = require('../middleware/authentication');
const authorizeRoles = require('../middleware/authorization');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(isAuth, authorizeRoles('admin'), productController.createProduct);

router.post(
  '/uploadImage',
  isAuth,
  authorizeRoles('admin'),
  productController.uploadProductImage
);

router
  .route('/:productId')
  .get(productController.getSingleProduct)
  .patch(isAuth, authorizeRoles('admin'), productController.updateProduct)
  .delete(isAuth, authorizeRoles('admin'), productController.deleteProduct);

module.exports = router;