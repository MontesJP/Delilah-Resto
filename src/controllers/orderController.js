const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Payment = require('../models/paymentModel');

const getTotal = async (user) => {
  let value = 0;
  user.shoppingCart.forEach((el) => {
    value += el.price;
    return value;
  });
};

exports.getAllOrders = async (req, res) => {
  try {
    const order = await Order.find().select('-__v');

    res.status(200).json({
      status: 'success',
      results: order.length,
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const order = await Order.findOne(req.params.id);

    if (!(user._id === order.user._id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You cannot access that order',
      });
    }
    res.status(200).json({
      status: 'success',
      order,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined',
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('shoppingCart');
    console.log(user.shoppingCart);

    const address = req.body.address || user.address;
    let products = [];
    products = user.shoppingCart;
    const total = await getTotal();
    const { paymentMethod } = req.body;

    const order = await Order.create({
      address,
      user: user._id,
      products,
      total,
      paymentMethod,
    });

    res.status(201).json({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// exports.updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         product,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

// exports.deleteProduct = async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);

//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };
