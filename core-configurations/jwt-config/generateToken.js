const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Token generation
const generateAccessToken = (user) => {
  const { id, emailId } = user;
  return jwt.sign({ id, emailId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const generateRefreshToken = (user) => {
  const { id, emailId } = user;
  return jwt.sign({ id, emailId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
