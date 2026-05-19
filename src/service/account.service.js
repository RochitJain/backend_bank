const accountModel = require("../models/account.models");
const AppError = require("../utils/AppError");

async function checkAccountDetails(id) {
  const accountDetails = await accountModel.findById({
    _id: id,
  });
  if (!accountDetails) throw new AppError("Account not found", 404);
    
  return accountDetails;
}

async function checkSystemAccountDetails(user) {
  const accountDetails = await accountModel.findOne({
    user: user._id,
    admin: true,
  });
  return accountDetails;
}

async function create(user) {
  const isAccountExsist = await accountModel.findOne({user: user._id})
  if(isAccountExsist) throw new AppError("Account already exists", 409);

  const accountCreate = await accountModel.create({ user: user._id });
  if (accountCreate) return accountCreate;
}

async function getAccountDetails(user) {
  const accounts = await accountModel.findOne({ user });
  return accounts;
}

async function getAccountBalance(user) {
  const accountInfo = await accountModel.findOne({ user });
  if (!accountInfo) {
  throw new AppError("Account not found", 404);
}
  const balance = await accountInfo.getBalance();
  return {balance,accountInfo};
}

module.exports = {
  checkAccountDetails,
  create,
  checkSystemAccountDetails,
  getAccountDetails,
  getAccountBalance,
};
