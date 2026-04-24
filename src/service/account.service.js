const accountModel = require('../models/account.models')

async function checkAccountDetails(id) {
    const accountDetails = await accountModel.findById({
        _id: id,
    })
    if (accountDetails) return accountDetails
}

async function create(user) {
    const userCreated = await accountModel.create({user: user._id})
    if (userCreated) return userCreated
}

module.exports = {checkAccountDetails, create}