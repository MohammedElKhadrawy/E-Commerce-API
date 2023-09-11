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
// in addition to using 'signed' option for the token-cookie
// if a secret was provided to cookieParser, it will unsign and validate any signed cookie values
// and then move them from req.cookies to req.signedCookies
app.use(cookieParser(process.env.JWT_SECRET));

app.get('/', (req, res, next) => {
  res.send('<h1>E-Commerce API</h1>');
});

// testing route for cookie access
app.get('/api/v1', (req, res, next) => {
  // console.log(req.cookies);
  console.log(req.signedCookies);
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
