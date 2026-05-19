const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const AppError = require("../utils/AppError");

async function authMiddleware(req, res, next) {
  const token =
    req.cookies.token ||
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);

  if (!token) throw new AppError("User not authorized", 401);

  const isTokenBlacklisted = await blacklistModel.findOne({ token });
  if (isTokenBlacklisted) throw new AppError("Invalid token, login again", 401);

  const id = jwt.verify(token, process.env.JWT_KEY);
  const userData = await userModel.findById(id.userId);

  req.user = userData;
  next();
}

async function authSystemMiddleware(req, res, next) {
  const token =
    req.cookies.token ||
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);
  
  
  if (!token) throw new AppError("User not authorized", 403)

  const isTokenBlacklisted = await blacklistModel.findOne({ token });
  
  if (isTokenBlacklisted) throw new AppError("Invalid token, login again" , 401);

  const id = jwt.verify(token, process.env.JWT_KEY);
  const userData = await userModel.findById(id.userId).select("+admin");
  if (!userData.admin) throw new AppError("Unauthorized", 403);
  req.user = userData;
  next();
}

module.exports = { authMiddleware, authSystemMiddleware };
