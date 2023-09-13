const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/userController');
const isAuth = require('../middleware/authentication');
const authorizePermissions = require('../middleware/authorization');

const router = express.Router();

router.get(
  '/',
  isAuth,
  authorizePermissions('admin'),
  userController.getAllUsers
);

router.get('/showMe', isAuth, userController.showCurrentUser);

router.patch('/updateUser', userController.updateUser);

router.patch(
  '/updateUserPassword',
  isAuth,
  [
    body('oldPassword', 'Old password must not be empty').trim().notEmpty(),
    body('newPassword')
      .trim()
      .isLength({ min: 8 })
      .withMessage('password must be at least 8 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) // min-length of 8 characters and at least one letter and one number!
      .withMessage('password must contain at least 1 letter and 1 number'),
  ],
  userController.updateUserPassword
);

// we have to place the dynamic route at the very end so the router does not treat the above get routes as dynamic segments
// so it won't for example consider showMe as a userId
router.get('/:userId', isAuth, userController.getSingleUser);

module.exports = router;
