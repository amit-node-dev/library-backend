const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

// USER MODEL
const { User, Role, sequelize } = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

// CREATE / REGISTER USER
const createUser = async (req, res) => {
  try {
    logger.info("userControllers --> createUser --> reached");

    let {
      firstname,
      lastname,
      email,
      age,
      password,
      country,
      state,
      city,
      mobileNumber,
    } = req.body;

    const ageInt = parseInt(age, 10);

    const points = 100;

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists with the given email or mobile number
    let user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { mobileNumber }],
      },
    });

    if (user) {
      // Update user details
      user.firstname = firstname;
      user.lastname = lastname;
      user.email = email;
      user.age = ageInt;
      user.password = hashedPassword;
      user.country = country;
      user.state = state;
      user.city = city;
      user.points = points;

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      await user.save();

      logger.info("userControllers --> createUser --> updated existing user");
      return successResponse(res, message.COMMON.UPDATE_SUCCESS, user, 200);
    }

    // Create new user
    user = await User.create({
      firstname,
      lastname,
      email,
      age: ageInt,
      password: hashedPassword,
      country,
      state,
      city,
      mobileNumber,
      points,
    });

    logger.info("userControllers --> createUser --> ended");
    return successResponse(res, message.COMMON.REGISTER_SUCCESS, user, 201);
  } catch (error) {
    logger.error("userControllers --> createUser --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// GET ALL LIST OF USERS
const getAllUserList = async (req, res) => {
  try {
    logger.info("userControllers --> getAllUserList --> reached");

    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    // Validate if User exists and is active
    const user = await User.findOne({
      where: { email: email },
      include: [{ model: Role, as: "role" }],
    });

    if (!user) {
      return errorResponse(res, "User not found or inactive.", null, 404);
    }

    // Check role-based access
    const allowedRoles = ["super_admin", "admin", "customer"];
    if (!allowedRoles.includes(user.role?.name)) {
      return errorResponse(
        res,
        "You are not authorized to access this resource.",
        null,
        403
      );
    }

    // Extract query parameters with default values
    const {
      page = 1,
      pageSize = 5,
      search = "",
      role = "",
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
    const limit = parseInt(pageSize, 10);

    // Building the where condition
    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { firstname: { [Op.iLike]: `%${search}%` } },
        { lastname: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (role) {
      whereCondition.role_id = role;
    }

    // Fetch users with pagination
    const { count, rows } = await User.findAndCountAll({
      where: whereCondition,
      offset,
      limit,
      order: [[sortBy, sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC"]],
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["name"],
        },
      ],
    });

    const responseData = {
      items: rows,
      total: count,
      page: parseInt(page, 10),
      itemsPerPage: limit,
      totalPages: Math.ceil(count / limit),
    };

    logger.info("userControllers --> getAllUserList --> ended");
    return successResponse(
      res,
      message.COMMON.LIST_FETCH_SUCCESS,
      responseData,
      200
    );
  } catch (error) {
    logger.error("userControllers --> getAllUserList --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    logger.info("userControllers --> getUserById --> reached");

    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    logger.info("userControllers --> getUserById --> ended");
    return successResponse(res, message.COMMON.FETCH_SUCCESS, user, 200);
  } catch (error) {
    logger.error("userControllers --> getUserById --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// UPDATE USER BY ID
const updateUser = async (req, res) => {
  try {
    logger.info("userControllers --> updateUser --> reached");

    let { id } = req.params;
    let {
      firstname,
      lastname,
      email,
      age,
      mobileNumber,
      oldpassword,
      password,
      country,
      state,
      city,
      role,
    } = req.body;
    // Ensure the mobile number includes the country code
    if (mobileNumber && !mobileNumber.startsWith("+91")) {
      mobileNumber = `+91${mobileNumber}`;
    }

    let user = await User.findByPk(id);
    if (!user) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    if (oldpassword && password) {
      let isMatch = await bcrypt.compare(oldpassword, user.password);
      if (!isMatch) {
        return errorResponse(res, message.AUTH.INVALID_OLD_PASSWORD, null, 400);
      }
      user.password = await bcrypt.hash(password, 10);
    }

    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.age = age;
    user.mobileNumber = mobileNumber;
    user.password = password;
    user.country = country;
    user.state = state;
    user.city = city;
    user.role_id = role;

    await user.save();

    logger.info("userControllers --> updateUser --> ended");
    return successResponse(res, message.COMMON.UPDATE_SUCCESS, user, 200);
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
  try {
    logger.info("userControllers --> deleteUser --> reached");

    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    await user.destroy();

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

    const { email, userId } = req.body;
    const user = await User.findOne({
      where: { email, id: userId },
    });
    if (!user) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    logger.info("userControllers --> getCurrentUserPoints --> ended");
    return successResponse(
      res,
      message.COMMON.FETCH_SUCCESS,
      { points: user.points },
      200
    );
  } catch (error) {
    logger.error("userControllers --> getCurrentUserPoints --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

module.exports = {
  createUser,
  getAllUserList,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUserPoints,
};
