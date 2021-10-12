const express = require('express');
const productController = require('../productController');
const authController = require('../authController');
const cache = require('../cache');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, cache.cache, productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.createProduct
  );

router
  .route('/cart/:id')
  .post(authController.protect, productController.addShoppingCart)
  .patch(authController.protect, productController.removeShoppingCart);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct
  );

module.exports = router;
