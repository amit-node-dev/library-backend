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
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token || isBlacklisted(token)) {
    return errorResponse(res, message.AUTH.UNAUTHORIZED_TOKEN, null, 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    req.email = decoded.email;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logger.error("Token has expired ::: ", error);
      return errorResponse(res, message.TOKEN.TOKEN_EXPIRED, error, 401);
    } else {
      logger.error("Error in verifying token ::: ", error);
      return errorResponse(res, message.TOKEN.INVALID_TOKEN, error, 403);
    }
  }
};

module.exports = { verifyToken };
