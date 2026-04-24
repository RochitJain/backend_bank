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
    const transaction  = new transactionModel({
        fromAccount, toAccount, amount, idempotencyKey, status: 'PENDING'
    })

    await ledgerModel.create([{
        account: toAccount, transaction: transaction._id, amount, type: 'CREDIT'
    }],{session})
    
    await ledgerModel.create([{
        account: fromAccount, transaction: transaction._id, amount, type: 'DEBIT'
    }],{session})
    
    transaction.status = 'COMPLETE'
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()
    return res.status(201).json({message: 'Trasaction completed'})
} 

async function createInitialTransaction(req, res) {
    const {toAccount, idempotencyKey, amount} = req.body
    if(!toAccount || !idempotencyKey || !amount) {
        return res.status(400).json({message: "Some field is missing"}) }
    
    const toAccountDetails = await accountService.checkAccountDetails(toAccount);
    if(!toAccountDetails) return res.status(400).json({message: "Invalid Account"})
    
    const fromAccountDetails = await accountService.checkSystemAccountDetails(req.user)
    if(!fromAccountDetails) return res.status(400).json({message: "Invalid Admin Account"})

     const session = await mongoose.startSession()
    session.startTransaction()
    const transaction  = new transactionModel({
        fromAccount : fromAccountDetails._id, toAccount, amount, idempotencyKey, status: 'PENDING'
    })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount, transaction: transaction._id, amount, type: 'CREDIT'
    }],{session})
    
    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccountDetails._id, transaction: transaction._id, amount, type: 'DEBIT'
    }],{session})

      transaction.status = 'COMPLETE'
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()
    return res.status(201).json({message: 'Trasaction completed'})
}


module.exports = {createTransaction, createInitialTransaction}