const jwt = require('jsonwebtoken');
require('dotenv').config();

// we use object destructuring so we don't have to care about the order of the arguments passed (if there were more than one)
const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFESPAN,
  });
};

exports.attachCookiesToResponse = ({ res, tokenUser }) => {
  const token = createJWT({ payload: tokenUser });
  // another approach to store the token in a cookie,
  // that is only accessible for the browser,
  // and is automatically sent back with every incoming request
  const oneDay = 24 * 60 * 60 * 1000;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    // this makes sure that the cookie is only sent back over https
    // which is for deployment/production only, in development we work with http
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

exports.verifyToken = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);
