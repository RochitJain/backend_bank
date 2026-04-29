const accountModel = require("../models/account.models");

async function checkAccountDetails(id) {
  const accountDetails = await accountModel.findById({
    _id: id,
  });
  if (accountDetails) return accountDetails;
}

async function checkSystemAccountDetails(user) {
  const accountDetails = await accountModel.findOne({
    user,
    admin: true,
  });
  return accountDetails;
}

async function create(user) {
  const userCreated = await accountModel.create({ user: user._id });
  if (userCreated) return userCreated;
}

async function getAccountDetails(user) {
  const accounts = await accountModel.find({ user });
  return accounts;
}

async function getAccountBalance(user) {
  const userInfo = await accountModel.findOne({ user });
  const balance = await userInfo.getBalance();
  return balance;
}

module.exports = {
  checkAccountDetails,
  create,
  checkSystemAccountDetails,
  getAccountDetails,
  getAccountBalance,
};
