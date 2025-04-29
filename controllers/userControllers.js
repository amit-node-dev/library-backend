const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

// USER MODEL
const { User, Role, sequelize } = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const Messages = require("../utils/commonMessages");

// REGISTER USER
const registerUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    logger.info("userControllers --> registerUser --> reached");

    const {
      firstName,
      lastName,
      emailId,
      age,
      password,
      country,
      state,
      city,
      mobileNumber,
    } = req.body;

    // Validate required fields
    if (!emailId) {
      await transaction.rollback();
      return errorResponse(res, Messages.VALIDATION.REQUIRED_FIELD, null, 400);
    }

    // Check for existing user
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ emailId }, { mobileNumber }] },
      transaction,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password || "Default@123", 10);

    let user;
    if (existingUser) {
      // Update existing user
      await existingUser.update(
        {
          firstName,
          lastName,
          emailId,
          age: parseInt(age, 10),
          password: hashedPassword,
          country,
          state,
          city,
          mobileNumber,
          points: existingUser.points || 100,
        },
        { transaction }
      );

      user = existingUser;
    } else {
      // Create new user
      user = await User.create(
        {
          firstName,
          lastName,
          emailId,
          age: parseInt(age, 10),
          password: hashedPassword,
          country,
          state,
          city,
          mobileNumber,
          points: 100,
        },
        { transaction }
      );
    }

    await transaction.commit();

    const message = existingUser
      ? Messages.COMMON.UPDATE_SUCCESS
      : Messages.COMMON.REGISTER_SUCCESS;

    logger.info("userControllers --> registerUser --> ended");
    return successResponse(res, message, user, existingUser ? 200 : 201);
  } catch (error) {
    logger.error("userControllers --> registerUser --> error", error);
    return errorResponse(
      res,
      Messages.SERVER.INTERNAL_ERROR,
      error.message,
      500
    );
  }
};

// GET ALL LIST OF USERS
const getAllUserList = async (req, res) => {
  try {
    logger.info("userControllers --> getAllUserList --> reached");

    // Verify and decode token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return errorResponse(res, Messages.AUTH.UNAUTHORIZED, null, 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: "role" }],
    });

    if (!currentUser) {
      return errorResponse(res, Messages.AUTH.INVALID_USER, null, 404);
    }

    // Parse query parameters
    const {
      page = 1,
      pageSize = 10,
      search = "",
      role = "",
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page));
    const limit = Math.max(1, parseInt(pageSize));
    const offset = (pageNumber - 1) * limit;

    // Build filters
    const filters = {};
    if (search) {
      filters[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { emailId: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (role) {
      filters.roleId = role;
    }

    // Fetch paginated results
    const { count, rows: users } = await User.findAndCountAll({
      where: filters,
      include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
      offset,
      limit,
      order: [[sortBy, sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC"]],
      attributes: { exclude: ["password"] },
    });

    const responseData = {
      items: users,
      total: count,
      page: parseInt(page, 10),
      pageSize: limit,
    };

    logger.info("userControllers --> getAllUserList --> ended");
    return successResponse(
      res,
      Messages.COMMON.LIST_FETCH_SUCCESS,
      responseData,
      200
    );
  } catch (error) {
    logger.error("userControllers --> getAllUserList --> error", error);
    if (error.name === "JsonWebTokenError") {
      return errorResponse(res, Messages.AUTH.INVALID_TOKEN, null, 401);
    }
    return errorResponse(res, Messages.SERVER.INTERNAL_ERROR, null, 500);
  }
};

// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    logger.info("userControllers --> getUserById --> reached");

    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [{ model: Role, as: "role", attributes: ["name"] }],
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return errorResponse(res, Messages.COMMON.NOT_FOUND, null, 404);
    }

    logger.info("userControllers --> getUserById --> ended");
    return successResponse(res, Messages.COMMON.FETCH_SUCCESS, user, 200);
  } catch (error) {
    logger.error("userControllers --> getUserById --> error", error);
    return errorResponse(res, Messages.SERVER.INTERNAL_SERVER_ERROR, null, 500);
  }
};

// UPDATE USER BY ID
const updateUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    logger.info("userControllers --> updateUser --> reached");

    const { id } = req.params;
    const {
      firstName,
      lastName,
      emailId,
      age,
      mobileNumber,
      oldPassword,
      newPassword,
      country,
      state,
      city,
      roleId,
    } = req.body;

    const user = await User.findByPk(id, { transaction });
    if (!user) {
      await transaction.rollback();
      return errorResponse(res, Messages.COMMON.NOT_FOUND, null, 404);
    }

    // Handle password change
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        await transaction.rollback();
        return errorResponse(
          res,
          Messages.AUTH.OLD_PASSWORD_MISMATCH,
          null,
          400
        );
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user details
    await user.update(
      {
        firstName,
        lastName,
        emailId,
        age: parseInt(age, 10),
        mobileNumber,
        country,
        state,
        city,
        roleId: roleId ? roleId : user.roleId,
      },
      { transaction }
    );

    await transaction.commit();

    logger.info("userControllers --> updateUser --> ended");
    return successResponse(res, Messages.COMMON.UPDATE_SUCCESS, user, 200);
  } catch (error) {
    logger.error("userControllers --> updateUser --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// DELETE USER BY ID
const deleteUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    logger.info("userControllers --> deleteUser --> reached");

    const { id } = req.params;
    const user = await User.findByPk(id, { transaction });

    if (!user) {
      await transaction.rollback();
      return errorResponse(res, Messages.COMMON.NOT_FOUND, null, 404);
    }

    // Prevent self-deletion
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id === user.id) {
        await transaction.rollback();
        return errorResponse(
          res,
          Messages.COMMON.SELF_DELETION_FORBIDDEN,
          null,
          400
        );
      }
    }

    await user.destroy({ transaction });
    await transaction.commit();

    logger.info("userControllers --> deleteUser --> ended");
    return successResponse(res, message.COMMON.DELETE_SUCCESS, user, 200);
  } catch (error) {
    logger.error("userControllers --> deleteUser --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// GET CURRENT USER POINTS
const getCurrentUserPoints = async (req, res) => {
  try {
    logger.info("userControllers --> getCurrentUserPoints --> reached");

    const { userId } = req.body;
    const user = await User.findByPk(userId, {
      attributes: ["id", "points"],
    });

    if (!user) {
      return errorResponse(res, Messages.COMMON.NOT_FOUND, null, 404);
    }

    logger.info("userControllers --> getCurrentUserPoints --> ended");
    return successResponse(
      res,
      Messages.COMMON.FETCH_SUCCESS,
      {
        points: user.points,
      },
      200
    );
  } catch (error) {
    logger.error("userControllers --> getCurrentUserPoints --> error", error);
    return errorResponse(
      res,
      Messages.SERVER.INTERNAL_ERROR,
      error.message,
      500
    );
  }
};

module.exports = {
  registerUser,
  getAllUserList,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUserPoints,
};
