const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/userController');
const isAuth = require('../middleware/authentication');
const authorizeRoles = require('../middleware/authorization');
const { validateNameAndEmail, validatePassword } = require('../utils');

const router = express.Router();

router.get('/', isAuth, authorizeRoles('admin'), userController.getAllUsers);

router.get('/showMe', isAuth, userController.showCurrentUser);

// we have to place the dynamic route at the very end so the router does not treat the above get routes as dynamic segments
// so it won't for example consider showMe as a userId
router.get('/:userId', isAuth, userController.getSingleUser);

router.patch(
  '/updateUser',
  isAuth,
  validateNameAndEmail(),
  userController.updateUser
);

router.patch(
  '/updateUserPassword',
  isAuth,
  [
    body('oldPassword', 'Old password must not be empty').trim().notEmpty(),
    validatePassword('newPassword'),
  ],
  userController.updateUserPassword
);

module.exports = router;
