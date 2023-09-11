const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('express-async-errors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.use(morgan('dev')); // request logger middleware
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res, next) => {
  res.send('<h1>E-Commerce API</h1>');
});

// testing route for cookie access
app.get('/api/v1', (req, res, next) => {
  console.log(req.cookies);
  res.send('<h1>E-Commerce API</h1>');
});

app.use('/api/v1/auth', authRoutes);

app.use(notFound); // catch-all route
app.use(errorHandler); // all errors will be forwarded to this middleware

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });
  })
  .catch((err) => console.log(err));
