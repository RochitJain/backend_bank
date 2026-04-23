const accountModel = require('../models/account.models')

async function createAccountController(req, res) {
    
    const user = req.user;
    const createAccount = await accountModel.create({
        user : user._id,
    })
    res.status(201).json({
        message: "account created"
    })
}


module.exports = {createAccountController}