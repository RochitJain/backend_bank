const userService = require("../service/user.service");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const AppError = require("../utils/AppError");

async function userRegisterController(req, res) {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) {
    throw new AppError("All fields are required", 400);
  }

  const isExists = await userService.checkUserExists(email);
  if (isExists) {
    throw new AppError("User already exists with email", 409)
  }

  const user = await userService.createUser(email, password, name);

  const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
    expiresIn: "1d",
  });

  res.cookie("token", token);
  return res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
  });
}

async function userLoginContoller(req, res) {
  const { email, password } = req.body || {};
  if(!email || !password){
    throw new AppError('Field is missing',400)
  }
  const user = await userService.checkUserExists(email);

  if (!user) throw new AppError('User not found', 422)

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) throw new AppError('Invalid Password', 401)

  const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
    expiresIn: "1d",
  });

  res.cookie("token", token);
  res.status(201).json({
    _id: user._id,
    email: user.email,
    name: user.name,
  });
}

async function userLogoutController(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(200).json("User already logged out");

  res.clearCookie("token");
  await blacklistModel.create({ token });
  return res.status(200).json("User logged out successfully");
}

module.exports = {
  userRegisterController,
  userLoginContoller,
  userLogoutController,
};
