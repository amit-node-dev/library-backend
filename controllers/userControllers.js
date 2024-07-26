// USER MODEL
const { User } = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

// CREATE / REGISTER NEW USER
const createUser = async (req, res) => {
  try {
    logger.info("userControllers --> createUser --> reached");
    const { firstname, lastname, email, password } = req.body;

    const responseData = await User.create({
      firstname,
      lastname,
      email,
      password,
    });

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
  try {
    logger.info("userControllers --> getAllUserList --> reached");
    const responseData = await User.findAll();

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
  const { firstname, lastname, email, password } = req.body;
  try {
    const responseData = await User.findByPk(id);

    if (!responseData) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    responseData.firstname = firstname;
    responseData.lastname = lastname;
    responseData.email = email;
    responseData.password = password;

    await responseData.save();

    logger.info("userControllers --> updateUser --> ended");
    return successResponse(
      res,
      message.COMMON.UPDATE_SUCCESS,
      responseData,
      200
    );
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
    const responseData = await User.findByPk(id);

    if (!responseData) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    await responseData.destroy();

    logger.info("userControllers --> deleteUser --> ended");
    return successResponse(
      res,
      message.COMMON.DELETE_SUCCESS,
      responseData,
      200
    );
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
