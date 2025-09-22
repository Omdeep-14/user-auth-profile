import crypto from "crypto";

export const generateCSRF = (req, res, next) => {
  let token = req.cookies.csrf_token;

  if (!token) {
    token = crypto.randomBytes(12).toString("hex");
    res.cookie("csrf_token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
  }

  req.csrfToken = token;

  res.status(200).json({
    success: true,
    csrfToken: req.csrfToken,
  });
  next();
};
