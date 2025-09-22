export const verifyCSRF = (req, res, next) => {
  const serverCSRF = req.cookies.csrf_token;
  const clientCSRF = req.headers["x-csrf-token"];

  if (!serverCSRF || !clientCSRF || serverCSRF !== clientCSRF) {
    return res.status(400).json({
      status: false,
      message: "Invalid csrf token",
    });
  }

  next();
};
