const userService = require("../service/user.service");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const AppError = require("../utils/AppError");
const Joi = require("joi");
const userLoginSchemaValidator = require("../validator/user/userLogin.schema");
const userRegisterSchemaValidator = require("../validator/user/userRegistor.schema");
async function userRegisterController(req, res) {

  const { error, value } = userRegisterSchemaValidator.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorDetails = error.details.map((err) => err.message);
    throw new AppError(errorDetails, 400);
  }
  const { email, password, name } = value;
  const isExists = await userService.checkUserExists(email);
  if (isExists) {
    throw new AppError( "User already exists with email", 409);
  }
  
  const user = await userService.createUser(email, password, name);
  return res.status(201).json({
    success: true,
    message: "User Registered Successfully",
    data: {
      user: {
          _id: user._id,
          email: user.email,
          name: user.name,
    }
  }
  })
}

async function userLoginContoller(req, res) {
  const { error, value } = userLoginSchemaValidator.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorDetails = error.details.map((err) => err.message);
    throw new AppError(errorDetails, 400);
  }
  const { email, password } = value;
  
  const user = await userService.checkUserExists(email);

  if (!user) throw new AppError("User not found", 422);

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) throw new AppError("Invalid Password", 401);

  const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
    expiresIn: "1d",
  });
  res.cookie("token", token);
  res.status(201).json({
    _id: user._id,
    email: user.email,
    name: user.name,
    success: true
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
