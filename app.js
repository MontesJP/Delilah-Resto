const express = require('express');
const helmet = require('helmet');

const userRouter = require('./src/controllers/routers/userRouter');
const productRouter = require('./src/controllers/routers/productRouter');
const orderRouter = require('./src/controllers/routers/orderRouter');
const paymentRouter = require('./src/controllers/routers/paymentRouter');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/payments', paymentRouter);

module.exports = app;
