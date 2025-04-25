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

// Load the appropriate .env file
dotenv.config();

// Twilio Client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const loginUser = async (req, res) => {
  try {
    logger.info("authControllers --> loginUser --> reached");

    const { emailId, password } = req.body;

    // Trim and lowercase email to ensure consistency
    const normalizedEmail = emailId.trim().toLowerCase();

    // Find user with associated role
    const user = await User.findOne({
      where: { emailId: normalizedEmail },
      include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
    });

    if (!user) {
      logger.warn("Login failed - user not found:");
      return errorResponse(res, Messages.AUTH.USER_NOT_FOUND, null, 404);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn("Login failed - invalid password for:");
      return errorResponse(res, Messages.AUTH.INVALID_CREDENTIALS, null, 403);
    }

    // Extract role info
    const role = user?.role || {};
    const { id: roleId, name: roleName } = role;

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      emailId: user.emailId,
      role: roleName,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      emailId: user.emailId,
    });

    // Prepare response data
    const responseData = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        roleId,
        roleName,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };

    logger.info("Login successful for:", emailId);
    return successResponse(res, Messages.COMMON.WELCOME, responseData, 200);
  } catch (error) {
    logger.error("authControllers --> loginUser --> error", error);
    return errorResponse(
      res,
      Messages.SERVER.INTERNAL_ERROR,
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
      return errorResponse(res, Messages.AUTH.UNAUTHORIZED, null, 401);
    }

    const token = authHeader.split(" ")[1];
    await addToBlacklist(token);

    logger.info("User logged out successfully");
    return successResponse(res, Messages.AUTH.LOGOUT_SUCCESS, null, 200);
  } catch (error) {
    logger.error("authControllers --> logoutUser --> error", error);
    return errorResponse(
      res,
      Messages.SERVER.INTERNAL_ERROR,
      error.message,
      500
    );
  }
};

const sentOTP = async (req, res) => {
  try {
    logger.info("authControllers --> sentOTP --> reached");

    const { mobileNumber, mode } = req.body;

    if (!mobileNumber) {
      return errorResponse(res, "Missing Mobile Number", null, 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { mobileNumber },
    });

    // Mode-specific validations
    if (mode === "reset" && !existingUser) {
      return errorResponse(res, Messages.AUTH.USER_NOT_FOUND, null, 404);
    }

    if (mode === "create" && existingUser) {
      return errorResponse(res, Messages.AUTH.USER_EXISTS, null, 409);
    }

    try {
      await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({
          to: `+91${mobileNumber}`,
          channel: "sms",
        });

      // Handle user creation only for 'create' mode
      let responseData = {};
      if (mode === "create") {
        const tempUser = await User.create({
          firstName: "Temp",
          lastName: "User",
          emailId: `temp-${Date.now()}@example.com`,
          password: await bcrypt.hash("Temp@1234", 10),
          mobileNumber,
        });
        responseData.tempUserId = tempUser.id;
      }

      logger.info(`OTP sent to ${mobileNumber} for ${mode} mode`);
      return successResponse(res, Messages.AUTH.OTP_SENT, responseData, 200);
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

    // Verify OTP
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${mobileNumber}`,
        code: otp,
      });

    if (verification.status !== "approved") {
      return errorResponse(res, Messages.AUTH.INAVLID_OTP, null, 400);
    }

    // Get verified user
    const user = await User.findOne({
      where: { mobileNumber },
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

const verifyUserDetails = async (req, res) => {
  try {
    logger.info("authControllers --> verifyUserDetails --> reached");

    const { emailId, mobileNumber } = req.body;

    // Validate both fields are provided
    if (!emailId || !mobileNumber) {
      return errorResponse(
        res,
        "Both email and mobile number are required",
        null,
        400
      );
    }

    // Find user by email (to check email separately)
    const userByEmail = await User.findOne({ where: { emailId } });
    // Find user by mobile (to check mobile separately)
    const userByMobile = await User.findOne({ where: { mobileNumber } });

    // Check verification status
    const emailValid = !!userByEmail;
    const mobileValid = !!userByMobile;
    const bothValid =
      emailValid && mobileValid && userByEmail.id === userByMobile.id;

    // Prepare response based on validation results
    if (!emailValid && !mobileValid) {
      logger.warn("Verification failed - both email and mobile are incorrect");
      return errorResponse(res, "Invalid email and mobile number", null, 400);
    } else if (!emailValid) {
      logger.warn("Verification failed - email is incorrect");
      return errorResponse(res, "Invalid email", null, 400);
    } else if (!mobileValid) {
      logger.warn("Verification failed - mobile number is incorrect");
      return errorResponse(res, "Invalid mobile number", null, 400);
    } else if (!bothValid) {
      logger.warn(
        "Verification failed - email and mobile don't belong to same user"
      );
      return errorResponse(
        res,
        "Email and mobile number don't match",
        null,
        400
      );
    }

    // If we get here, both are valid and belong to same user
    const user = userByEmail;

    // Prepare success response
    const responseData = {
      emailId: user.emailId,
      mobileNumber: user.mobileNumber,
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified,
    };

    logger.info("Verification successful for:", emailId);
    return successResponse(res, "Verification successful", responseData, 200);
  } catch (error) {
    logger.error("authControllers --> verifyUserDetails --> error", error);
    return errorResponse(
      res,
      Messages.SERVER.INTERNAL_ERROR,
      error.message,
      500
    );
  }
};

const resetPassword = async (req, res) => {
  try {
    logger.info("authControllers --> resetPassword --> reached");

    const { emailId, mobileNumber, password } = req.body;

    // Validate required fields
    if (!emailId || !mobileNumber) {
      return errorResponse(
        res,
        "Both email and mobile number are required",
        null,
        400
      );
    }

    if (!password) {
      return errorResponse(res, "New password is required", null, 400);
    }

    // Find user where both email AND mobile match
    const user = await User.findOne({
      where: {
        emailId,
        mobileNumber,
      },
    });

    if (!user) {
      logger.warn(
        "Password reset failed - user not found with provided email and mobile"
      );
      return errorResponse(
        res,
        "No user found with the provided email and mobile number",
        null,
        404
      );
    }

    /// Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return errorResponse(
        res,
        "New password cannot be the same as current password",
        null,
        400
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password
    await User.update({ password: hashedPassword }, { where: { id: user.id } });

    logger.info(`Password reset successful for user: ${emailId}`);
    return successResponse(res, "Password updated successfully", null, 200);
  } catch (error) {
    logger.error("authControllers --> resetPassword --> error", error);
    return errorResponse(
      res,
      Messages.SERVER.INTERNAL_ERROR,
      error.message,
      500
    );
  }
};

module.exports = {
  loginUser,
  logoutUser,
  sentOTP,
  verifyOTP,
  verifyUserDetails,
  resetPassword,
};
