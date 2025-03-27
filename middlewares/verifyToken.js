const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// CORE-CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS MODULES
const message = require("../utils/commonMessages");
const { errorResponse } = require("../utils/handleResponse");

// MIDDLEWARE
const { isBlacklisted } = require("../middlewares/blackListToken");

dotenv.config();

// THIS FUNCTIONALITY WILL VERIFY THE GENERATED TOKEN AND PROVIDE THE ACCESS TO FURTHER ROUTES.
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Authorization header
  if (!authHeader) {
    logger.warn("Authorization header missing");
    return errorResponse(res, message.AUTH.UNAUTHORIZED_TOKEN, null, 401);
  }

  // Extract token from "Bearer <token>"
  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    logger.warn("Invalid authorization header format");
    return errorResponse(res, message.AUTH.UNAUTHORIZED_TOKEN, null, 401);
  }

  const token = tokenParts[1];

  // Check against token blacklist
  if (isBlacklisted(token)) {
    logger.warn("Attempt to use blacklisted token");
    return errorResponse(res, message.AUTH.TOKEN_REVOKED, null, 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      ...(decoded.role && { role: decoded.role }) 
    };

    next();
  } catch (error) {
    logger.error(`Token verification failed: ${error.message}`);

    switch (error.name) {
      case "TokenExpiredError":
        return errorResponse(res, message.AUTH.TOKEN_EXPIRED, error, 401);
      case "JsonWebTokenError":
        return errorResponse(res, message.AUTH.INVALID_TOKEN, error, 403);
      default:
        return errorResponse(res, message.AUTH.UNAUTHORIZED_TOKEN, error, 401);
    }
  }
};

module.exports = { verifyToken };
