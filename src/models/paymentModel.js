const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An Payment needs a name'],
  },
  description: {
    type: String,
    required: [true, 'An Payment needs a description'],
  },
  status: {
    type: String,
    enum: ['Available', 'Unavailable'],
    default: 'Available',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

paymentSchema.pre(/^find/, function (next) {
  // THIS points to the actual query
  this.find({ status: { $ne: 'Unavailable' } });
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
