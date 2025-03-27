const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Validate required JWT environment variables
const requiredEnvVars = [
  "JWT_SECRET",
  "JWT_EXPIRATION",
  "JWT_REFRESH_SECRET",
  "JWT_REFRESH_EXPIRATION",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`Missing JWT environment variable: ${envVar}`);
    throw new Error(`Missing required JWT configuration: ${envVar}`);
  }
}

// Token generation
const generateAccessToken = (user) => {
  const { id, email, role } = user;
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const generateRefreshToken = (user) => {
  const { id, email } = user;
  return jwt.sign({ id, email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
