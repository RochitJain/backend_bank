const transactionModel = require('../models/transaction.model')
const accountModel = require('../models/account.models')
const transactionService = require('../service/transaction.service')
const accountService = require('../service/account.service')
const mongoose = require('mongoose')
const ledgerModel = require('../models/ledger.model')


async function createTransaction (req, res) {
    const {fromAccount, toAccount, idempotencyKey, amount} = req.body

    if(!fromAccount || !toAccount || !idempotencyKey || !amount) {
        return res.status(400).json({message: "Some field is missing"}) }

    
    const fromAccountDetails = await accountService.checkAccountDetails(fromAccount);
    const toAccountDetails = await accountService.checkAccountDetails(toAccount);
    if(!fromAccountDetails || !toAccountDetails) return res.status(400).json({message: "Invalid Account"})

    //check idempotency key
    const isTransactionExists = await transactionService.isTransactionExists(idempotencyKey)
    if(isTransactionExists) return res.json(isTransactionExists)
    
    //account status check
    if( fromAccountDetails.status !== 'ACTIVE' || toAccountDetails.status !== 'ACTIVE') 
        return res.status(400).json({message: "Account not active"})

    //check balance from sender
    const balance = await fromAccountDetails.getBalance()
    if(balance < amount) return res.status(400).json({message: `Insufficient Balance ${balance}, amount ${amount}`})
    
    //adding transaction
    const session = await mongoose.startSession()
    session.startTransaction()
    const transaction  = await transactionModel.create({
        fromAccount, toAccount, amount, idempotencyKey, status: 'PENDING'
    },{session})

    const creditLedgerEntry = await ledgerModel.create({
        account: toAccount, transaction: transaction._id, amount, type: 'CREDIT'
    },{session})
    
    const debitLedgerEntry = await ledgerModel.create({
        account: fromAccount, transaction: transaction._id, amount, type: 'DEBIT'
    },{session})
    
    transaction.status = 'COMPLETE'
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()
} 

module.exports = {createTransaction}