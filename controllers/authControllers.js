const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const twilio = require("twilio");

// Models
const { User, Role } = require("../models");

// Core Config
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../core-configurations/jwt-config/generateToken");
const logger = require("../core-configurations/logger-config/logger");

// Middleware
const { addToBlacklist } = require("../middlewares/blackListToken");

// Utils
const { successResponse, errorResponse } = require("../utils/handleResponse");
const Messages = require("../utils/commonMessages");

dotenv.config();

// Twilio Client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const loginUser = async (req, res) => {
  try {
    logger.info("authControllers --> loginUser --> reached");

    const { email, password } = req.body;

    // Find user with associated role
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: "roles", }],
    });

    if (!user) {
      logger.warn("Login failed - user not found:", email);
      return errorResponse(res, Messages.AUTH.INVALID_USER, null, 404);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn("Login failed - invalid password for:", email);
      return errorResponse(res, Messages.AUTH.INVALID_PASSWORD, null, 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.Role?.name,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    // Prepare response data
    const responseData = {
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.Role?.name,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };

    logger.info("Login successful for:", email);
    return successResponse(res, Messages.AUTH.LOGIN_SUCCESS, responseData, 200);
  } catch (error) {
    logger.error("authControllers --> loginUser --> error", error);
    return errorResponse(
      res,
      Messages.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

const logoutUser = async (req, res) => {
  try {
    logger.info("authControllers --> logoutUser --> reached");

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return errorResponse(res, Messages.AUTH.UNAUTHORIZED_TOKEN, null, 401);
    }

    const token = authHeader.split(" ")[1];
    await addToBlacklist(token);

    logger.info("User logged out successfully");
    return successResponse(res, Messages.AUTH.LOGOUT, null, 200);
  } catch (error) {
    logger.error("authControllers --> logoutUser --> error", error);
    return errorResponse(
      res,
      Messages.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

const sentOTP = async (req, res) => {
  try {
    logger.info("authControllers --> sentOTP --> reached");

    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return errorResponse(res, Messages.AUTH.MISSING_PHONE_NUMBER, null, 400);
    }

    // Format mobile number
    const formattedNumber = mobileNumber.startsWith("+")
      ? mobileNumber
      : `+91${mobileNumber}`;

    // Check if user exists
    const existingUser = await User.findOne({
      where: { mobileNumber: formattedNumber },
    });

    if (existingUser) {
      return errorResponse(res, Messages.AUTH.ALREADY_EXIST, null, 409);
    }

    // Fetch the role IDs to associate with users
    const role = await Role.findOne({ where: { name: "customer" } });
    if (!role) {
      return errorResponse(res, "Customer role not found", null, 500);
    }

    // Get customer role
    const customerRole = await Role.findOne({ where: { name: "customer" } });
    if (!customerRole) {
      throw new Error("Customer role not configured");
    }

    // Create temporary user (consider removing this in production)
    await User.create({
      firstname: "Temp",
      lastname: "User",
      email: `temp-${Date.now()}@example.com`,
      password: await bcrypt.hash("Temp@1234", 10),
      roleId: customerRole.id,
      mobileNumber: formattedNumber,
    });

    // Send OTP
    await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: formattedNumber,
        channel: "sms",
      });

    logger.info(`OTP sent to ${formattedNumber}`);
    return successResponse(res, Messages.AUTH.OTP_SENT, null, 200);
  } catch (error) {
    logger.error("authControllers --> sentOTP --> error", error);
    return errorResponse(
      res,
      Messages.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

const verifyOTP = async (req, res) => {
  try {
    logger.info("authControllers --> verifyOTP --> reached");

    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return errorResponse(
        res,
        !mobileNumber
          ? Messages.AUTH.MISSING_PHONE_NUMBER
          : Messages.AUTH.MISSING_OTP,
        null,
        400
      );
    }

    const formattedNumber = mobileNumber.startsWith("+")
      ? mobileNumber
      : `+91${mobileNumber}`;

    // Verify OTP
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: formattedNumber,
        code: otp,
      });

    if (verification.status !== "approved") {
      return errorResponse(res, Messages.AUTH.INVALID_OTP, null, 400);
    }

    // Get verified user
    const user = await User.findOne({
      where: { mobileNumber: formattedNumber },
      include: [{ model: Role }],
    });

    if (!user) {
      return errorResponse(res, Messages.AUTH.INVALID_USER, null, 404);
    }

    return successResponse(res, Messages.AUTH.OTP_VERIFIED, user, 200);
  } catch (error) {
    logger.error("authControllers --> verifyOTP --> error", error);
    return errorResponse(
      res,
      Messages.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

module.exports = { loginUser, logoutUser, sentOTP, verifyOTP };
