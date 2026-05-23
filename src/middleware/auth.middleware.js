const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const AppError = require("../utils/AppError");
const logger = require("../config/logger");

async function authMiddleware(req, res, next) {
  logger.info('in authMiddleware')
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) throw new AppError("User not authorized", 401);

  const isTokenBlacklisted = await blacklistModel.findOne({ token });
  if (isTokenBlacklisted) throw new AppError("Invalid token, login again", 401);

  const id = jwt.verify(token, process.env.JWT_KEY);
  const userData = await userModel.findById(id.userId);
  if (!userData) throw new AppError("User not found", 403);
  req.user = userData;
  next();
}

async function authSystemMiddleware(req, res, next) {
  logger.info('in authSystemMiddleware')
  const token =
    req.cookies.token ||
    (req.authHeader && req.authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);
  
  
  if (!token) throw new AppError("User not authorized", 403)

  const isTokenBlacklisted = await blacklistModel.findOne({ token });
  
  if (isTokenBlacklisted) throw new AppError("Invalid token, login again" , 401);

  const id = jwt.verify(token, process.env.JWT_KEY);
  const userData = await userModel.findById(id.userId).select("+admin");
  if (!userData.admin) throw new AppError("User not found", 403);
  req.user = userData;
  next();
}

module.exports = { authMiddleware, authSystemMiddleware };
