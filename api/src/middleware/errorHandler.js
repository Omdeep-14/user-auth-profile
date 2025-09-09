export const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server error",
  });
};
