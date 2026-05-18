const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.models");
const transactionService = require("../service/transaction.service");
const accountService = require("../service/account.service");
const mongoose = require("mongoose");
const ledgerModel = require("../models/ledger.model");
const AppError = require("../utils/AppError");

async function createTransaction(req, res) {
  const { fromAccount, toAccount, idempotencyKey, amount } = req.body;

  if (!fromAccount || !toAccount || !idempotencyKey || !amount) {
    throw new AppError("Some field is missing", 400);
  }

  const fromAccountDetails =
    await accountService.checkAccountDetails(fromAccount);
  const toAccountDetails = await accountService.checkAccountDetails(toAccount);
  if (!fromAccountDetails || !toAccountDetails)
    throw new AppError("Account not found" , 400);

  //check idempotency key
  const isTransactionExists =
    await transactionService.isTransactionExists(idempotencyKey);
  if (isTransactionExists) return res.json(isTransactionExists);

  //account status check
  if (
    fromAccountDetails.status !== "ACTIVE" ||
    toAccountDetails.status !== "ACTIVE"
  )
    throw new AppError("Account not active", 403);

  //check balance from sender
  const balance = await fromAccountDetails.getBalance();
  if (balance < amount)
    throw new AppError (`Insufficient Balance ${balance}, amount ${amount}`, 404);

  //adding transaction
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];

    await ledgerModel.create(
      [
        {
          account: toAccount,
          transaction: transaction._id,
          amount,
          type: "CREDIT",
        },
      ],
      { session },
    );

    await ledgerModel.create(
      [
        {
          account: fromAccount,
          transaction: transaction._id,
          amount,
          type: "DEBIT",
        },
      ],
      { session },
    );

    await transactionModel.findByIdAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETE" },
      { session },
    );

    await session.commitTransaction();
  } catch (err) {
    session.abortTransaction();
    throw new AppError('session Aborted')
  } finally {
    session.endSession();
  }
}

async function createInitialTransaction(req, res) {
  const { toAccount, idempotencyKey, amount } = req.body;
  if (!toAccount || !idempotencyKey || !amount) {
    throw new AppError("Some field is missing", 400);
  }

  const toAccountDetails = await accountService.checkAccountDetails(toAccount);
  if (!toAccountDetails)
    throw new AppError("Account not found" , 400);

  const fromAccountDetails = await accountService.checkSystemAccountDetails(
    req.user,
  );
  if (!fromAccountDetails)
    throw new AppError("Account not found" , 400);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const transaction = new transactionModel({
      fromAccount: fromAccountDetails._id,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    });

    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          transaction: transaction._id,
          amount,
          type: "CREDIT",
        },
      ],
      { session },
    );

    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromAccountDetails._id,
          transaction: transaction._id,
          amount,
          type: "DEBIT",
        },
      ],
      { session },
    );

    transaction.status = "COMPLETE";
    await transaction.save({ session });

    await session.commitTransaction();
  } catch (err) {
    session.abortTransaction();
  } finally {
    session.endSession();
  }
}

module.exports = { createTransaction, createInitialTransaction };
