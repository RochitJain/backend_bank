const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const accountController = require("../controller/account.controller");

router.post(
 "/account/create",
  auth.authMiddleware,
  accountController.createAccountController,
);
router.get(
 "/account/account-info",
  auth.authMiddleware,
  accountController.getUserInfoController,
);
router.get(
 "/account/balance",
  auth.authMiddleware,
  accountController.getBalanceController,
);

module.exports = router;
