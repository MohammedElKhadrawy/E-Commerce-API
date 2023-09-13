const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const { validateNameAndEmail, validatePassword } = require('../utils');

const router = express.Router();

router.post(
  '/register',
  [validateNameAndEmail(), validatePassword('password')],
  authController.register
);

router.post(
  '/login',
  [
    body('email', 'E-mail must not be empty').trim().notEmpty(),
    body('password', 'Password must not be empty').trim().notEmpty(),
  ],
  authController.login
);

router.get('/logout', authController.logout);

module.exports = router;
