const express = require('express');
const userController = require('../userController');
const authController = require('../authController');

const router = express.Router();

router.param('id', (req, res, next, val) => {
  console.log(`User id is ${val}`);
  next();
});

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  );

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.patch(
  '/suspend/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.suspendUser
);

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUser
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser
  );

module.exports = router;
