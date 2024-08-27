const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

// USER MODEL
const { User, sequelize } = require("../models");

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
      role,
      mobileNumber,
    } = req.body;

    const ageInt = parseInt(age, 10);

    // Ensure mobile number includes the country code
    let formattedMobileNumber = mobileNumber;
    let user;
    if (mobileNumber) {
      if (!mobileNumber.startsWith("+91")) {
        formattedMobileNumber = `+91${mobileNumber}`;
      } else {
        formattedMobileNumber = mobileNumber;
      }

      // Check if a user with the same mobile number exists
      user = await User.findOne({
        where: { mobileNumber: formattedMobileNumber },
      });

      if (user) {
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.password = password;
        user.age = ageInt;
        user.country = country;
        user.state = state;
        user.city = city;
        user.role_id = role;

        user = await user.save();
      }
    } else {
      user = await User.create({
        firstname,
        lastname,
        email,
        age: ageInt,
        password,
        country,
        state,
        city,
        role_id: role,
        mobileNumber: formattedMobileNumber,
      });
    }

    logger.info("userControllers --> createUser --> ended");
    return successResponse(res, message.COMMON.ADDED_SUCCESS, user, 201);
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

    const { page = 1, pageSize = 5, search = "", role = "" } = req.query;
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize, 10);

    // Building the where condition
    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { firstname: { [Op.like]: `%${search}%` } },
        { lastname: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (role) {
      whereCondition.role_id = role;
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereCondition,
      offset,
      limit,
      include: [
        {
          model: sequelize.models.Role,
          as: "role",
          attributes: ["name"],
        },
      ],
    });

    let responseData = {
      users: rows,
      total: count,
      page: parseInt(page, 10),
      pageSize: limit,
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
    user.roleId = role;

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

module.exports = {
  createUser,
  getAllUserList,
  getUserById,
  updateUser,
  deleteUser,
};
