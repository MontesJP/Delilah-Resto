const express = require('express');
const orderController = require('../orderController');
const authController = require('../authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, orderController.getAllOrders)
  .post(authController.protect, orderController.createOrder);

router.route('/:id').get(orderController.getOrder);
// .patch(
//   authController.protect,
//   authController.restrictTo('admin'),
//   orderController.updateProduct
// )
// .delete(
//   authController.protect,
//   authController.restrictTo('admin'),
//   orderController.deleteProduct
// );

module.exports = router;
