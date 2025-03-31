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

    // Trim and lowercase email to ensure consistency
    const normalizedEmail = email.trim().toLowerCase();

    // Find user with associated role
    const user = await User.findOne({
      where: { email: normalizedEmail },
      include: [{ model: Role, as: "roles", attributes: ["id", "name"] }],
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

    const roleInfo = user?.roles?.dataValues;
    console.log("AAA ", roleInfo)

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: roleInfo?.name,
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
        roleId: roleInfo?.id,
        roleName: roleInfo?.name,
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

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { mobileNumber: formattedNumber },
    });

    if (existingUser) {
      return errorResponse(res, Messages.AUTH.USER_EXISTS, null, 409);
    }

    // Get customer role (fetch once instead of twice)
    const customerRole = await Role.findOne({ where: { name: "customer" } });
    if (!customerRole) {
      return errorResponse(res, "Customer role not configured", null, 500);
    }

    try {
      // Attempt to send OTP first
      await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({
          to: formattedNumber,
          channel: "sms",
        });

      // Only create user if OTP was successfully sent
      const tempUser = await User.create({
        firstname: "Temp",
        lastname: "User",
        email: `temp-${Date.now()}@example.com`,
        password: await bcrypt.hash("Temp@1234", 10),
        roleId: customerRole.id,
        mobileNumber: formattedNumber,
      });

      logger.info(`OTP sent to ${formattedNumber}`);
      return successResponse(
        res,
        Messages.AUTH.OTP_SENT,
        {
          tempUserId: tempUser.id,
        },
        200
      );
    } catch (twilioError) {
      logger.error("Failed to send OTP:", twilioError);
      return errorResponse(res, "Failed to send OTP", null, 500);
    }
  } catch (error) {
    logger.error("authControllers --> sentOTP --> error", error);
    return errorResponse(
      res,
      Messages.SERVER.INTERNAL_ERROR,
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
      return errorResponse(res, Messages.AUTH.INAVLID_OTP, null, 400);
    }

    // Get verified user
    const user = await User.findOne({
      where: { mobileNumber: formattedNumber },
      include: [{ model: Role, as: "roles" }],
    });

    if (!user) {
      return errorResponse(res, Messages.AUTH.USER_NOT_FOUND, null, 404);
    }

    return successResponse(res, Messages.AUTH.OTP_VERIFIED, user, 200);
  } catch (error) {
    logger.error("authControllers --> verifyOTP --> error", error);
    return errorResponse(
      res,
      Messages.SERVER.INTERNAL_ERROR,
      error.message,
      500
    );
  }
};

module.exports = { loginUser, logoutUser, sentOTP, verifyOTP };
