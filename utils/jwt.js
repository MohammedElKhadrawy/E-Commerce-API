const jwt = require('jsonwebtoken');
require('dotenv').config();

// we use object destructuring so we don't have to care about the order of the arguments passed (if there were more than one)
exports.createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFESPAN,
  });
};

exports.verifyToken = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);
