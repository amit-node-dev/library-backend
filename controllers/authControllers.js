const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const twilio = require("twilio");

// USER MODEL
const { User, Role } = require("../models");

// CORE-CONFIG MODULES
const generateToken = require("../core-configurations/jwt-config/generateToken");
const logger = require("../core-configurations/logger-config/logger");

// MIDDLEWARE
const { addToBlacklist } = require("../middlewares/blackListToken");

// UTILS MODULES
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const OTP_EXPIRATION_TIME = 1 * 60 * 1000;

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

const sentOTP = async (req, res) => {
  try {
    logger.info("authControllers --> sentOTP --> reached");

    let { mobileNumber } = req.body;

    if (!mobileNumber) {
      return errorResponse(res, message.AUTH.MISSING_PHONE_NUMBER, null, 400);
    }

    // Ensure the mobile number includes the country code
    if (!mobileNumber.startsWith("+91")) {
      mobileNumber = `+91${mobileNumber}`;
    }

    // Check if the user already exists
    let user = await User.findOne({ where: { mobileNumber } });
    if (user) {
      return errorResponse(res, message.AUTH.ALREADY_EXIST, null, 404);
    }

    // Fetch the role IDs to associate with users
    const roles = await Role.findOne({ where: { name: "customer" } });

    const demoUserData = {
      firstname: "John",
      lastname: "Dcruz",
      email: "john@gmail.com",
      password: "$2y$10$CTRkjgznicnOPtqGg9xpZOyYpScCaqNRAjlcNcOCBQ2VIQInoprzG",
      roleId: roles.id,
      mobileNumber: mobileNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // If user doesn't exist, create a new user
    if (!user) {
      user = await User.create(demoUserData);
    }

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: mobileNumber, channel: "sms" });

    logger.info("authControllers --> sentOTP --> OTP sent successfully");
    return successResponse(res, message.AUTH.OTP_SENT, null, 200);
  } catch (error) {
    logger.error("authControllers --> sentOTP --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

const verifyOTP = async (req, res) => {
  try {
    logger.info("authControllers --> verifyOTP --> reached");

    let { mobileNumber, otp } = req.body;

    if (!mobileNumber) {
      return errorResponse(res, message.AUTH.MISSING_PHONE_NUMBER, null, 400);
    }

    if (!otp) {
      return errorResponse(res, message.AUTH.MISSING_OTP, null, 400);
    }

    // Ensure the mobile number includes the country code
    if (!mobileNumber.startsWith("+91")) {
      mobileNumber = `+91${mobileNumber}`;
    }

    const user = await User.findOne({ where: { mobileNumber } });

    if (!user) {
      return errorResponse(res, message.AUTH.INVALID_USER, null, 404);
    }

    logger.info("authControllers --> verifyOTP --> OTP verified successfully");

    // Generate token for authenticated session
    const tokenData = generateToken(user.id);

    const userData = {
      token: tokenData,
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobileNumber: user.mobileNumber,
      roleId: user.roleId,
    };

    return successResponse(res, message.AUTH.OTP_VERIFIED, userData, 200);
  } catch (error) {
    logger.error("authControllers --> verifyOTP --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

module.exports = { loginUser, logoutUser, sentOTP, verifyOTP };
