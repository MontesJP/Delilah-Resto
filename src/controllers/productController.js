const Product = require('../models/productModel');
const User = require('../models/userModel');
const { storeObjectInCache, invalidateCache } = require('./cache');

exports.getAllProducts = async (req, res) => {
  try {
    const product = await Product.find().select('-__v');
    storeObjectInCache(req, product);
    res.status(200).json({
      status: 'success',
      results: product.length,
      data: {
        products: product,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      product,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    invalidateCache({
      method: 'GET',
      baseUrl: req.baseUrl,
    });
    res.status(201).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    invalidateCache({
      method: 'GET',
      baseUrl: req.baseUrl,
    });

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    invalidateCache({
      method: 'GET',
      baseUrl: req.baseUrl,
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.addShoppingCart = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const user = await User.findById(req.user.id);

    user.shoppingCart.push(product._id);

    user.save();

    res.status(200).json({
      status: 'success',
      cart: user.shoppingCart,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.removeShoppingCart = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const user = await User.findById(req.user.id);

    const filtered = user.shoppingCart.filter(
      // eslint-disable-next-line eqeqeq
      (el) => el._id != product.id
    );

    user.shoppingCart = filtered;
    user.save();

    res.status(200).json({
      status: 'success',
      data: {
        user: user._id,
        shoppingCart: user.shoppingCart,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
