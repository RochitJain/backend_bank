const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const transactionController = require("../controller/transaction.controller");

router.post(
  "/transaction",
  auth.authMiddleware,
  transactionController.createTransactionController,
);
router.post(
  "/transaction/system/initialfund",
  auth.authSystemMiddleware,
  transactionController.createInitialTransactionController,
);

module.exports = router;
