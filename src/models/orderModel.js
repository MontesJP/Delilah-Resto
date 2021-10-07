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
    },
  ],
  total: {
    type: Number,
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
    select: '-__v -productStatus -status',
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

orderSchema.pre(/^find/, function (next) {
  // THIS points to the actual query
  this.find({ orderStatus: { $ne: 'Cancelled' } });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
