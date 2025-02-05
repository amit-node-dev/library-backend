const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateAccessToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
