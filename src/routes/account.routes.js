const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const accountController = require('../controller/account.controller')

router.post('/create', auth.authMiddleware, accountController.createAccountController)
// router.get('/user-info', authMiddleware, accountController)

module.exports  = router