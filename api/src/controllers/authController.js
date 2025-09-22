import mongoose from "mongoose";
import User from "../models/user.model.js";
import { createAccessToken, createRefreshToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";
import { signUpSchema } from "../utils/signUpSchema.js";
import { loginSchema } from "../utils/loginSchema.js";
import mongoSanitize from "mongo-sanitize";

/**
 * @desc signup new user
 * @route POST api/auth/signup
 * @access public
 */

export const signUp = async (req, res, next) => {
  try {
    let raw = req.body;
    raw = mongoSanitize(raw);
    const { username, email, password } = signUpSchema.parse(raw);

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const accessToken = createAccessToken({
      sub: newUser._id,
      role: newUser.role,
    });
    const refreshToken = createRefreshToken({
      sub: newUser._id,
      tokenVersion: newUser.tokenVersion,
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        username: newUser.username,
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc signin new user
 * @route POST api/auth/signin
 * @access public
 */

export const login = async (req, res, next) => {
  try {
    let raw = req.body;
    raw = mongoSanitize(raw);
    const { identifier, password } = raw;

    identifier = mongoSanitize(identifier);
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }

    const userExists = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invald credentials",
      });
    }

    const accessToken = createAccessToken({
      sub: userExists._id,
      role: userExists.role,
    });

    const refreshToken = createRefreshToken({
      sub: userExists._id,
      tokenVersion: userExists.tokenVersion,
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "Login Successfull",
      user: {
        id: userExists._id,
        username: userExists.username,
        email: userExists.email,
        role: userExists.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

//logout controller

export const logout = async (req, res, next) => {
  try {
    const userId = req.user.sub;

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { tokenVersion: 1 },
    });

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json({
      status: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};
