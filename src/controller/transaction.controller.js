const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.models");
const transactionService = require("../service/transaction.service");
const accountService = require("../service/account.service.js");
const mongoose = require("mongoose");
const ledgerModel = require("../models/ledger.model");
const AppError = require("../utils/AppError");
const transactionSchemaValidator = require("../validator/transaction/transaction.validator.js");

async function createTransactionController(req, res) {
  const { error, value } = transactionSchemaValidator.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorDetails = error.details.map((err) => err.message);
    throw new AppError(errorDetails, 400);
  }
  const { toAccount, idempotencyKey, amount } = value;
  if (!toAccount || !idempotencyKey || !amount) {
    throw new AppError("Some field is missing", 400);
  }
  const user = req.user._id;
  const fromAccountDetails = await accountService.getAccountDetails(user);

  const toAccountDetails = await accountService.checkAccountDetails(toAccount);

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
    throw new AppError(
      `Insufficient Balance ${balance}, amount ${amount}`,
      404,
    );

  //adding transaction
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const transaction = (
      await transactionModel.create(
        [
          {
            fromAccount: fromAccountDetails._id,
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
          account: fromAccountDetails._id,
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
    return res.status(201).json({
      success: true,
      message: "Transaction completed",
    });
  } catch (err) {
    session.abortTransaction();
    throw new AppError("session Aborted");
  } finally {
    session.endSession();
  }
}

async function createInitialTransactionController(req, res) {
  const { toAccount, idempotencyKey, amount } = req.body;
  if (!toAccount || !idempotencyKey || !amount) {
    throw new AppError("Some field is missing", 400);
  }
  await accountService.checkAccountDetails(toAccount);
  const fromAccountDetails = await accountService.checkSystemAccountDetails(
    req.user,
  );
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const isTransactionExists =
      await transactionService.isTransactionExists(idempotencyKey);
    if (isTransactionExists) return res.json(isTransactionExists);

    const transaction = await transactionModel.create({
      fromAccount: fromAccountDetails._id,
      toAccount: toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    });
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
          account: fromAccountDetails._id,
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
    return res.status(201).json({
      success: true,
      message: "Transaction completed",
    });
  } catch (err) {
    session.abortTransaction();
    throw new AppError(err, 500);
  } finally {
    session.endSession();
  }
}

module.exports = { createTransactionController, createInitialTransactionController };
