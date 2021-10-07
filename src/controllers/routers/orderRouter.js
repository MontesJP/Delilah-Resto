const express = require('express');
const orderController = require('../orderController');
const authController = require('../authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    orderController.getAllOrders
  )
  .post(authController.protect, orderController.createOrder);

router
  .route('/:id')
  .get(authController.protect, orderController.getOrder)
  .patch(authController.protect, orderController.updateOrder)
  .delete(authController.protect, orderController.cancelOrder);

router
  .route('/status/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    orderController.updateOrderStatus
  );
module.exports = router;
