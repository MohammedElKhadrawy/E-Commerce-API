const User = require('../models/User');
const throwCustomError = require('../errors/custom-error');
const {
  collectValidationResult,
  createTokenUser,
  attachCookiesToResponse,
} = require('../utils');

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
  res.status(200).json({ user: req.user });
};

// updateUser using user.save() [triggers pre-save hook, and therefore the pw hashing!]
exports.updateUser = async (req, res, next) => {
  collectValidationResult(req);
  const {
    body: { name, email },
    user: { userId },
  } = req;
  const user = await User.findById(userId);
  user.name = name;
  user.email = email;
  await user.save();
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, tokenUser });
  res.status(200).json({ user: tokenUser });
};

exports.updateUserPassword = async (req, res, next) => {
  collectValidationResult(req);
  const {
    body: { oldPassword, newPassword },
    user: { userId },
  } = req;
  const user = await User.findById(userId);
  const isPasswordCorrect = await user.checkPassword(oldPassword);
  if (!isPasswordCorrect) {
    throwCustomError('invalid credentials', 401);
  }
  user.password = newPassword; // hashing is done pre-save in the User model
  await user.save();
  res.status(200).json({ message: 'Successfully updated password!' });
};

// // updateUser using findByIdAndUpdate [doesn't trigger pre-save hook]
// exports.updateUser = async (req, res, next) => {
//   collectValidationResult(req);
//   const {
//     body: { name, email },
//     user: { userId },
//   } = req;
//   const user = await User.findByIdAndUpdate(
//     userId,
//     { name, email },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, tokenUser });
//   res.status(200).json({ user: tokenUser });
// };
