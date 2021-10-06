const express = require('express');
const paymentController = require('../paymentController');
const authController = require('../authController');

const router = express.Router();

router
  .route('/')
  .get(paymentController.getAllPayments)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    paymentController.createPayment
  );

router
  .route('/:id')
  .get(paymentController.getPayment)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    paymentController.updatePayment
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    paymentController.deletePayment
  );

module.exports = router;
