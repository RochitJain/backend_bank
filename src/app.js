const express = require("express");
const app = express();
const { rateLimit } = require("express-rate-limit");
const userRouter = require("./routes/user.routes");
const accountRouter = require("./routes/account.routes");
const cookieParser = require("cookie-parser");
const transactionRouter = require("./routes/transaction.routes");

app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});
app.use(limiter);
app.get("/", (req, res) => {
  res.send("Project is Live");
});
app.use("/api/auth", userRouter);
app.use("/api/account", accountRouter);
app.use("/api/transaction", transactionRouter);
module.exports = app;
