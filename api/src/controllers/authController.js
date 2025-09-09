import mongoose from "mongoose";
import User from "../models/user.model.js";
import { createAccessToken, createRefreshToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

/**
 * @desc signup new user
 * @route POST api/auth/signup
 * @access public
 */

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

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
    const { identifier, password } = req.body;
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

    res.status(201).json({
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
