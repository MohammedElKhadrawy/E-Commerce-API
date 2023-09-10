const express = require('express');
const { body } = require('express-validator');

const User = require('../models/User');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('please provide a name of length 3-50')
      .isAlphanumeric()
      .withMessage('name must only consist of letters and numbers'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('please provide a valid E-mail')
      .normalizeEmail()
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error('A user with this E-mail already exists');
        }
      }),
    body('password')
      .trim()
      .isLength({ min: 8 })
      .withMessage('password must be at least 8 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) // min-length of 8 characters and at least one letter and one number!
      .withMessage('password must contain at least 1 letter and 1 number'),
  ],
  authController.register
);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router;
