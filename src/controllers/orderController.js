/* eslint-disable eqeqeq */
const Order = require('../models/orderModel');
const User = require('../models/userModel');

const getTotal = async (user) => {
  let value = 0;
  user.shoppingCart.forEach((el) => {
    value += el.price;
    return value;
  });
  return value;
};

exports.getAllOrders = async (req, res) => {
  try {
    const order = await Order.find().select('-__v');

    res.status(200).json({
      status: 'success',
      results: order.length,
      data: {
        orders: order,
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
    const order = await Order.findById(req.params.id);

    if (user.id == order.user.id || user.role === 'admin') {
      return res.status(200).json({
        status: 'success',
        order,
      });
    }
    return res.status(403).json({
      status: 'fail',
      message: 'You cannot access that order',
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.shoppingCart.length < 1) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please first add a product to your shopping cart',
      });
    }
    const address = req.body.address || user.address;
    const products = user.shoppingCart;
    const total = await getTotal(user);
    const { paymentMethod } = req.body;

    const order = await Order.create({
      address,
      user: user._id,
      products,
      total,
      paymentMethod,
    });

    user.shoppingCart = [];
    user.save();

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

exports.updateOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const order = await Order.findById({ _id: req.params.id });

    if (user._id != order.user.id && user.role != 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not allowed to edit this order',
      });
    }
    if (order.orderStatus != 'Pending' && user.role != 'admin') {
      return res.status(401).json({
        status: 'fail',
        message: `Order status: ${order.orderStatus}. You can't make any updates`,
      });
    }

    if (req.body.address) {
      order.address = req.body.address;
    }
    if (req.body.paymentMethod) {
      order.paymentMethod = req.body.paymentMethod;
    }
    if (req.body.add) {
      order.products.push(req.body.add);
    }
    if (req.body.remove) {
      const filtered = order.products.filter((el) => el._id != req.body.remove);
      order.products = filtered;
      return order.products;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      status: 'success',
      updatedOrder,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const order = await Order.findByIdAndUpdate(req.params.id);

    if (user._id != order.user.id && user.role != 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not allowed to edit this order',
      });
    }
    if (order.orderStatus != 'Pending' && user.role != 'admin') {
      return res.status(401).json({
        status: 'fail',
        message: `Order status: ${order.orderStatus}. You can't cancel this order`,
      });
    }

    order.orderStatus = 'Cancelled';
    await order.validate();
    order.save();

    res.status(204).json({
      status: 'success',
      order: order.id,
      orderStatus: order.orderStatus,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.orderStatus = `${req.body.orderStatus}`;

    await order.validate();
    order.save();

    res.status(200).json({
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

exports.myOrderHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const order = await Order.find({ user: user._id });

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
      message: err.message,
    });
  }
};
