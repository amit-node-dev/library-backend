const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

// USER MODEL
const { User } = require("../models");

// CORE-CONFIG MODULES
const generateToken = require("../core-configurations/jwt-config/generateToken");
const logger = require("../core-configurations/logger-config/logger");

// MIDDLEWARE
const { addToBlacklist } = require("../middlewares/blackListToken");

// UTILS MODULES
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

dotenv.config();

const loginUser = async (req, res) => {
  try {
    logger.info("authControllers --> loginUser --> reached");

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return errorResponse(res, message.AUTH.INVALID_USER, null, 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, message.AUTH.INVALID_PASSWORD, null, 401);
    }

    // GENERATE TOKEN
    const tokenData = generateToken(user.id);

    const userData = {
      token: tokenData,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      roleId: user.roleId,
    };

    logger.info("authControllers --> loginUser --> ended");
    return successResponse(res, message.AUTH.VERIFIED_USER, userData, 200);
  } catch (error) {
    logger.error("authControllers --> loginUser --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

const logoutUser = (req, res) => {
  try {
    logger.info("authControllers --> logoutUser --> reached");

    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return errorResponse(res, message.AUTH.UNAUTHORIZED_TOKEN, null, 401);
    }

    addToBlacklist(token);

    logger.info("authControllers --> logoutUser --> ended");
    return successResponse(res, message.AUTH.LOGOUT, null, 200);
  } catch (error) {
    logger.error("authControllers --> logoutUser --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

module.exports = { loginUser, logoutUser };
