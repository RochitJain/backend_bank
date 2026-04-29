const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

router.post("/register", userController.userRegisterContoller);
router.post("/login", userController.userLoginContoller);
router.post("/logout", userController.userLogoutController);

module.exports = router;
