const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");


router.post("/user/register", userController.userRegisterController);
router.post("/user/login", userController.userLoginContoller);
router.post("/user/logout", userController.userLogoutController);

module.exports = router;
