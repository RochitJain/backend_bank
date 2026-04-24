const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const transactionController = require('../controller/transaction.controller')


router.post('/', auth.authMiddleware,transactionController.createTransaction)

module.exports = router