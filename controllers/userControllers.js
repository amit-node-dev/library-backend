const bcrypt = require("bcrypt");

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

    let ageInt = parseInt(age);

    // Ensure the mobile number includes the country code
    if (!mobileNumber.startsWith("+91")) {
      mobileNumber = `+91${mobileNumber}`;
    }

    let findUserByMobileNumber = await User.findOne({
      where: { mobileNumber },
    });

    let responseData;

    if (findUserByMobileNumber) {
      findUserByMobileNumber.firstname = firstname;
      findUserByMobileNumber.lastname = lastname;
      findUserByMobileNumber.email = email;
      findUserByMobileNumber.password = password;

      responseData = await findUserByMobileNumber.save();
    } else {
      responseData = await User.create({
        firstname,
        lastname,
        email,
        age: ageInt,
        password,
        country,
        state,
        city,
        roleId: role,
        mobileNumber,
      });
    }

    logger.info("userControllers --> createUser --> ended");
    return successResponse(
      res,
      message.COMMON.ADDED_SUCCESS,
      responseData,
      201
    );
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
  const { page = 1, pageSize = 5 } = req.query;

  try {
    logger.info("userControllers --> getAllUserList --> reached");
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize, 10);

    const { count, rows } = await User.findAndCountAll({
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

    const responseData = {
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
  logger.info("userControllers --> getUserById --> reached");
  const { id } = req.params;
  try {
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
  logger.info("userControllers --> updateUser --> reached");
  const { id } = req.params;
  const {
    firstname,
    lastname,
    email,
    age,
    oldpassword,
    password,
    country,
    state,
    city,
    role,
  } = req.body;
  try {
    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    if (oldpassword && password) {
      const isMatch = await bcrypt.compare(oldpassword, user.password);
      if (!isMatch) {
        return errorResponse(res, message.AUTH.INVALID_OLD_PASSWORD, null, 400);
      }
      user.password = await bcrypt.hash(password, 10);
    }

    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.age = age;
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
  logger.info("userControllers --> deleteUser --> reached");
  const { id } = req.params;
  try {
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
