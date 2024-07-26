// USER MODEL
const { User } = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

// ADD NEW AUTHORS
const addNewAuthors = async (req, res) => {
  try {
    logger.info("authorControllers --> addNewAuthors --> reached");
    const { firstname, lastname, email } = req.body;

    const responseData = await User.create({
      firstname,
      lastname,
      email,
    });

    logger.info("authorControllers --> addNewAuthors --> ended");
    return successResponse(
      res,
      message.COMMON.ADDED_SUCCESS,
      responseData,
      201
    );
  } catch (error) {
    logger.error("authorControllers --> addNewAuthors --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// GET ALL LIST OF AUTHORS
const getAllAuthorsList = async (req, res) => {
  try {
    logger.info("authorControllers --> getAllAuthorsList --> reached");
    const responseData = await User.findAll();

    logger.info("authorControllers --> getAllAuthorsList --> ended");
    return successResponse(
      res,
      message.COMMON.LIST_FETCH_SUCCESS,
      responseData,
      200
    );
  } catch (error) {
    logger.error("authorControllers --> getAllAuthorsList --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// GET AUTHORS BY ID
const getAuthorsById = async (req, res) => {
  logger.info("authorControllers --> getAuthorsById --> reached");
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    logger.info("authorControllers --> getAuthorsById --> ended");

    return successResponse(res, message.COMMON.FETCH_SUCCESS, user, 200);
  } catch (error) {
    logger.error("authorControllers --> getAuthorsById --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// UPDATE AUTHORS BY ID
const updateAuthors = async (req, res) => {
  logger.info("authorControllers --> updateAuthors --> reached");
  const { id } = req.params;
  const { firstname, lastname, email } = req.body;
  try {
    const responseData = await User.findByPk(id);

    if (!responseData) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    responseData.firstname = firstname;
    responseData.lastname = lastname;
    responseData.email = email;

    await responseData.save();

    logger.info("authorControllers --> updateAuthors --> ended");
    return successResponse(
      res,
      message.COMMON.UPDATE_SUCCESS,
      responseData,
      200
    );
  } catch (error) {
    logger.error("authorControllers --> updateAuthors --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// DELETE AUTHORS BY ID
const deleteAuthors = async (req, res) => {
  logger.info("authorControllers --> deleteAuthors --> reached");
  const { id } = req.params;
  try {
    const responseData = await User.findByPk(id);

    if (!responseData) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    await responseData.destroy();

    logger.info("authorControllers --> deleteAuthors --> ended");
    return successResponse(
      res,
      message.COMMON.DELETE_SUCCESS,
      responseData,
      200
    );
  } catch (error) {
    logger.error("authorControllers --> deleteAuthors --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

module.exports = {
  addNewAuthors,
  getAllAuthorsList,
  getAuthorsById,
  updateAuthors,
  deleteAuthors,
};
