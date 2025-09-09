import jwt from "jsonwebtoken";

/**
 * Create Access Token
 * @param {Object} payload - e.g. { sub: userId, role }
 * @returns {string} JWT token
 */

export const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "10m",
  });
};

/**
 * Create Refresh Token
 * @param {Object} payload - e.g. { sub: userId, tokenVersion }
 * @returns {string} JWT token
 */

export const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
};
