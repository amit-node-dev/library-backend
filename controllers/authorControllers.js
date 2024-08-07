// USER MODEL
const { Author } = require("../models");

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

    const authUser = await Author.create({
      firstname,
      lastname,
      email,
    });

    logger.info("authorControllers --> addNewAuthors --> ended");
    return successResponse(res, message.COMMON.ADDED_SUCCESS, authUser, 201);
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
  const { page, pageSize } = req.query;

  try {
    logger.info("authorControllers --> getAllAuthorsList --> reached");

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize, 10);

    const { count, rows } = await Author.findAndCountAll({
      offset,
      limit,
    });

    const responseData = {
      authors: rows,
      total: count,
      page: parseInt(page, 10),
      pageSize: limit,
    };

    logger.info("authorControllers --> getAllAuthorsList --> ended");
    return successResponse(
      res,
      message.COMMON.LIST_FETCH_SUCCESS,
      responseData,
      200
    );
  } catch (error) {
    logger.info("authorControllers --> getAllAuthorsList --> ended");
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
    const authUser = await Author.findByPk(id);

    if (!authUser) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    logger.info("authorControllers --> getAuthorsById --> ended");

    return successResponse(res, message.COMMON.FETCH_SUCCESS, authUser, 200);
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
    const authUser = await Author.findByPk(id);

    if (!authUser) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    authUser.firstname = firstname;
    authUser.lastname = lastname;
    authUser.email = email;

    await authUser.save();

    logger.info("authorControllers --> updateAuthors --> ended");
    return successResponse(res, message.COMMON.UPDATE_SUCCESS, authUser, 200);
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
    const authUser = await Author.findByPk(id);

    if (!authUser) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    await authUser.destroy();

    logger.info("authorControllers --> deleteAuthors --> ended");
    return successResponse(res, message.COMMON.DELETE_SUCCESS, authUser, 200);
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
