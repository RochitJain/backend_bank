const userService = require("../service/user.service");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const AppError = require("../utils/AppError");
const Joi = require("joi");
const userLoginSchemaValidator = require('../validator/user/userLogin.schema')
const userRegisterSchemaValidator = require('../validator/user/userRegistor.schema');
const logger = require("../config/logger");
async function userRegisterController(req, res) {
  logger.info('in /user/register')
  const {error,value} = userRegisterSchemaValidator.validate(req.body, {
    abortEarly: false
  })

  if(error){
    const errorDetails = error.details.map(err => err.message)
    throw new AppError(errorDetails, 400)
  }
  const {email, password, name} = value
  
  logger.info('input validated')
  const isExists = await userService.checkUserExists(email);
  if (isExists) {
    throw new AppError("User already exists with email", 409)
  }

  const user = await userService.createUser(email, password, name);
  logger.info('User Registered with name',user.name)
  return res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
  });
}

async function userLoginContoller(req, res) {
  logger.info('in user/login');
  const {error, value} = userLoginSchemaValidator.validate(req.body,{abortEarly: false})
  if(error){
    const errorDetails = error.details.map(err => err.message)
    throw new AppError(errorDetails, 400)
  }
  logger.info('input validated')
  const { email, password } = value
  const user = await userService.checkUserExists(email);

  if (!user) throw new AppError('User not found', 422)

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) throw new AppError('Invalid Password', 401)

  const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
    expiresIn: "1d",
  });
    logger.info(`${user.name} user logged in`)
  res.cookie("token", token);
  res.status(201).json({
    _id: user._id,
    email: user.email,
    name: user.name,
  });
}

async function userLogoutController(req, res) {
  logger.info('in /user/logout')
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(200).json("User already logged out");

  res.clearCookie("token");
  await blacklistModel.create({ token });
  logger.info("User logged out successfully")
  return res.status(200).json("User logged out successfully");
}

module.exports = {
  userRegisterController,
  userLoginContoller,
  userLogoutController,
};
