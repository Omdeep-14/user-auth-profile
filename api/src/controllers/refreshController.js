import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { createAccessToken, createRefreshToken } from "../utils/jwt";

export const refreshToken = async (req, res, next) => {
  try {
    const rToken = req.cookies.refresh_token;
    if (!rToken) {
      return res.status(404).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(rToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const user = await User.findById(decoded.sub);
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired or invalid",
      });
    }

    const newAccessToken = createAccessToken({
      sub: user._id,
      role: user.role,
    });

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    const newRefreshToken = createRefreshToken({
      sub: user._id,
      tokenVersion: user.tokenVersion,
    });

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.json({
      success: true,
      message: "Tokens Refreshed",
    });
  } catch (error) {
    next(error);
  }
};
