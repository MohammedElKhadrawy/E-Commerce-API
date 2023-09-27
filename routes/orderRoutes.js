const express = require('express');

const orderController = require('../controllers/orderController');
const isAuth = require('../middleware/authentication');
const authorizeRoles = require('../middleware/authorization');

const router = express.Router();

router
  .route('/')
  .get([isAuth, authorizeRoles('admin')], orderController.getAllOrders)
  .post(isAuth, orderController.createOrder);

router.get('/showAllMyOrders', isAuth, orderController.getCurrentUserOrders);

router
  .route('/:orderId')
  .get(isAuth, orderController.getSingleOrder)
  .patch(isAuth, orderController.updateOrder);

module.exports = router;
