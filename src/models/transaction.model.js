const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: String,
      required: [true, "From Account needed for entry"],
      index: true,
      immutable: true,
      ref: "account",
    },
    toAccount: {
      type: String,
      required: [true, "To Account needed for entry"],
      index: true,
      ref: "account",
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETE", "FAILED", "REVERSED"],
        message: "Status can be either of these values",
      },
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: [true, "amount needed"],
      min: [0, "Amount cannot be negative"],
    },
    idempotencyKey: {
      type: String,
      required: [true, "Idempotency key is required"],
      index: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;
