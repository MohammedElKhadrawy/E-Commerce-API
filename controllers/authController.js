const User = require('../models/User');
const {
  collectValidationResult,
  attachCookiesToResponse,
  createTokenUser,
} = require('../utils');
const throwCustomError = require('../errors/custom-error');

exports.register = async (req, res, next) => {
  collectValidationResult(req);

  // This way we ONLY give the admin role to the very first created account
  // We can then change that manually from the database
  // this way we protect the "role" property even if it has been maliciously manipulated by the front-end
  const isFirstAccount = (await User.countDocuments()) === 0;
  const role = isFirstAccount ? 'admin' : 'user';
  const userData = { ...req.body, role };

  const user = await User.create(userData);
  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, tokenUser });
  res.status(201).json({ user: tokenUser });
};

exports.login = async (req, res, next) => {
  collectValidationResult(req);
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throwCustomError('Could not find a user with this E-mail', 401);
  }
  const isPasswordCorrect = await user.checkPassword(password); // don't forget to 'await'!
  if (!isPasswordCorrect) {
    throwCustomError('Wrong password!', 401);
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, tokenUser });
  res.status(200).json({ user: tokenUser });
};

exports.logout = async (req, res, next) => {
  res.clearCookie('token');
  // another approach
  // res.cookie('token', '', { httpOnly: true, expires: new Date(Date.now()) });
  res.status(200).json({ message: 'user logged out!' });
};
