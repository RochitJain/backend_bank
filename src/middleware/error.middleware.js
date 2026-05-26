function errorMiddleware (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};

module.exports = errorMiddleware;