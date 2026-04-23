const express = require('express')
const router = express.Router();
const authController = require('../controller/auth.controller')

router.post('/register', authController.userRegisterContoller)
router.post('/login', authController.userLoginContoller)



module.exports = router