const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const transactionController = require("../controller/transaction.controller");

router.post("/transaction", auth.authMiddleware, transactionController.createTransaction);
router.post(
  "/transaction/system/initialfund",
  auth.authSystemMiddleware,
  transactionController.createInitialTransaction,
);

module.exports = router;
