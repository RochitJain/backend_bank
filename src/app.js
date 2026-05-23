const express = require("express");
const app = express();
const { rateLimit } = require("express-rate-limit");
const userRouter = require("./routes/user.routes");
const accountRouter = require("./routes/account.routes");
const cookieParser = require("cookie-parser");
const transactionRouter = require("./routes/transaction.routes");
const errorMiddleware = require('../src/middleware/error.middleware')
const logger = require('../src/config/logger')

app.use(express.json({limit: '10kb'}));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});
app.use(limiter);
app.get("/", (req, res) => {
  res.send("Project is Live");
});
logger.info('in app.js')
app.use("/api/v1", userRouter);
app.use("/api/v1", accountRouter);
app.use("/api/v1", transactionRouter);

app.use(errorMiddleware)
module.exports = app;
