const { validationResult } = require('express-validator');
const throwCustomError = require('../errors/custom-error');

const User = require('../models/User');

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => err.msg);
    throwCustomError('Validation Failed', 422, extractedErrors);
  }
  // This way we ONLY give the admin role to the very first created account
  // We can then change that manually from the database
  // this way we protect the "role" property even if it has been maliciously manipulated by the front-end
  const isFirstAccount = (await User.countDocuments()) === 0;
  const role = isFirstAccount ? 'admin' : 'user';
  const userData = { ...req.body, role };
  const user = await User.create(userData);
  res.status(201).json({ user });
};

exports.login = async (req, res, next) => {
  res.send('login user');
};

exports.logout = async (req, res, next) => {
  res.send('logout user');
};
