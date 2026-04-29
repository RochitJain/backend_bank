const userModel = require("../models/user.models");

async function checkUserExists(email) {
  const user = await userModel.findOne({ email });
  if (user) return user;
}

async function createUser(email, password, name) {
  const user = await userModel.create({
    email,
    password,
    name,
  });
  return user;
}

module.exports = { checkUserExists, createUser };
