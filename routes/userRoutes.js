const express = require('express');

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

router.get('/showMe', userController.showCurrentUser);

router.patch('/updateUser', userController.updateUser);

router.patch('/updateUserPassword', userController.updateUserPassword);

// we have to place the dynamic route at the very end so the router does not treat the above get routes as dynamic segments
// so it won't for example consider showMe as a userId
router.get('/:userId', isAuth, userController.getSingleUser);

module.exports = router;
