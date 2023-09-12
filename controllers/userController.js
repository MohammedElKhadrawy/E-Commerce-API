const User = require('../models/User');
const throwCustomError = require('../errors/custom-error');

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(200).json({ users });
};

exports.getSingleUser = async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throwCustomError(`Could not find a user with ID: ${userId}`, 404);
  }
  res.status(200).json({ user });
};

exports.showCurrentUser = async (req, res, next) => {
  res.send('show current user');
};

exports.updateUser = async (req, res, next) => {
  res.send('update user');
};

exports.updateUserPassword = async (req, res, next) => {
  res.send('update user password');
};
