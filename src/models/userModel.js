const mongoose = require('mongoose');
const { createHmac } = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your fullname'],
    },
    username: {
      type: String,
      required: [true, 'A user needs an username'],
      unique: [true, 'Username is taken'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: [true, 'Email is taken'],
    },
    telephone: {
      type: Number,
      required: [true, 'Telephone number required'],
      unique: [true, 'Telephone number already registered'],
    },
    address: {
      type: String,
      required: [true, 'Please indicate your address'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
      select: false,
    },
    passwordChangedAt: Date,
    shoppingCart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
      },
    ],
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// userSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'shoppingCart',
//     select: '-__v -productStatus -_id -status',
//   });

//   next();
// });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await createHmac('sha256', this.password).digest('hex');

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre(/^find/, function (next) {
  // THIS points to the actual query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  candidatePassword = await createHmac('sha256', candidatePassword).digest(
    'hex'
  );

  return candidatePassword === userPassword;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // false means not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
