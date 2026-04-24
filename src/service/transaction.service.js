const transactionModel = require('../models/transaction.model')
const accountModel = require('../models/account.models')

// async function isAccountExists(fromAccount, toAccount) {
//     const fromUserAccount = await accountModel.findById({
//         _id: fromAccount
//     })
//     const toUserAccount = await accountModel.findById({
//         _id: toAccount
//     })
//     if(!fromUserAccount || !toUserAccount) {
//         return false
//     }
// }

async function isTransactionExists (idempotencyKey) {
    const accountDetails = await transactionModel.findOne({
        idempotencyKey
    })
    if(accountDetails){
        if(accountDetails.status === 'COMPLETE') return {status: 'COMPLETE', accountDetails}
        if(accountDetails.status ==='PENDING') return {status: 'PENDING'}
        if(accountDetails.status === 'FAILED') return {status: 'FAILED'}
    }

}



module.exports = {isTransactionExists}