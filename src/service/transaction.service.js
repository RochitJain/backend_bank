const transactionModel = require("../models/transaction.model");

async function isTransactionExists(idempotencyKey) {
  const accountDetails = await transactionModel.findOne({
    idempotencyKey,
  });
  if (accountDetails) {
    if (accountDetails.status === "COMPLETE")
      return { status: "Transaction Already Completed", accountDetails };
    if (accountDetails.status === "PENDING") return { status: "PENDING" };
    if (accountDetails.status === "FAILED") return { status: "FAILED" };
  }
}

module.exports = { isTransactionExists };
