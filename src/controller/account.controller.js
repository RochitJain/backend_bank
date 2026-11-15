const logger = require("../config/logger");
const accountService = require("../service/account.service");
const AppError = require("../utils/AppError");


async function createAccountController(req, res) {

  const user = req.user;
  if (!req.user) {
  throw new AppError("Unauthorized", 401);
}
  const account = await accountService.create(user);
  return res.status(201).json({
    success: true,
    account
  });
}

async function getUserInfoController(req, res) {
  const accounts = await accountService.getAccountDetails(req.user._id);
  return res.status(200).json({accounts, success: true});
}

async function getBalanceController(req, res) {
  const {balance, accountInfo} = await accountService.getAccountBalance(req.user._id);

  return res.status(200).json({ balance, account: accountInfo._id, success: true});
}

module.exports = {
  createAccountController,
  getUserInfoController,
  getBalanceController,
};
