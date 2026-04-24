const accountService = require('../service/account.service')

async function createAccountController(req, res) {
    
    const user = req.user;
    const account = await accountService.create(user)
    return res.status(201).json({
        account
    })
}


module.exports = {createAccountController}