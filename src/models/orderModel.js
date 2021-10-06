const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'Please indicate your order address'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'An order must belong to an user'],
  },
  orderStatus: {
    type: String,
    enum: [
      'Pending',
      'Confirmed',
      'Preparing',
      'Sending',
      'Delivered',
      'Cancelled',
    ],
    default: 'Pending',
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'An orders need at least one product'],
    },
  ],
  total: {
    type: Number,
    required: [true, 'An order needs a total price'],
  },
  paymentMethod: {
    type: mongoose.Schema.ObjectId,
    ref: 'Payment',
    required: [true, 'Please select a payment method'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'products',
    select: '-__v -productStatus -_id -status',
  })
    .populate({
      path: 'user',
      select: '-__v -password -passwordConfirm',
    })
    .populate({
      path: 'paymentMethod',
      select: '-__v -status',
    });

  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
