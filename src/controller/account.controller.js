const logger = require("../config/logger");
const accountService = require("../service/account.service");
const AppError = require("../utils/AppError");


async function createAccountController(req, res) {
  logger.info('in createAccountController')

  const user = req.user;
  if (!req.user) {
  throw new AppError("Unauthorized", 401);
}
  const account = await accountService.create(user);
  logger.info('Account Created')
  return res.status(201).json({
    account
  });
}

async function getUserInfoController(req, res) {
  logger.info('in getUserInfoController')
  const accounts = await accountService.getAccountDetails(req.user._id);
  return res.status(200).json(accounts);
}

async function getBalanceController(req, res) {
  logger.info('in getBalanceController');
  const {balance, accountInfo} = await accountService.getAccountBalance(req.user._id);

  return res.status(200).json({ balance, account: accountInfo._id});
}

module.exports = {
  createAccountController,
  getUserInfoController,
  getBalanceController,
};
