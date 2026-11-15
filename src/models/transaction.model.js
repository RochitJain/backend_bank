const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Types.ObjectId,
      required: [true, "From Account needed for entry"],
      index: true,
      immutable: true,
      ref: "account",
    },
    toAccount: {
      type: mongoose.Types.ObjectId,
      required: [true, "To Account needed for entry"],
      index: true,
      ref: "account",
      immutable: true
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
      min: [0.01, "Amount should be more than 0"],
    },
    idempotencyKey: {
      type: String,
      required: [true, "Idempotency key is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;
