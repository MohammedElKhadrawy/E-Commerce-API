const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.getAllUsers);

router.get('/showMe', userController.showCurrentUser);

router.patch('/updateUser', userController.updateUser);

router.patch('/updateUserPassword', userController.updateUserPassword);

// we have to place the dynamic route at the very end so the router does not treat the above routes as dynamic segments
// so it won't for example consider showMe as a userId
router.get('/:userId', userController.getSingleUser);

module.exports = router;
