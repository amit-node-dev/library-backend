const { Op } = require("sequelize");

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

    const { firstname, lastname, email, biography } = req.body;
    const authUser = await Author.create({
      firstname,
      lastname,
      email,
      biography,
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
  try {
    logger.info("authorControllers --> getAllAuthorsList --> reached");

    let responseData;
    const { page, pageSize, search = "" } = req.query;
    if (page && pageSize) {
      let offset = (page - 1) * pageSize;
      let limit = parseInt(pageSize, 10);

      // Building the where condition
      const whereCondition = {};

      if (search) {
        whereCondition[Op.or] = [
          { firstname: { [Op.like]: `%${search}%` } },
          { lastname: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ];
      }

      let result = await Author.findAndCountAll({
        where: whereCondition,
        offset,
        limit,
      });

      responseData = {
        authors: result.rows,
        total: result.count,
        page: parseInt(page, 10),
        pageSize: limit,
      };
    } else {
      let result = await Author.findAll({});
      responseData = {
        authors: result,
      };
    }

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
  try {
    logger.info("authorControllers --> getAuthorsById --> reached");

    const { id } = req.params;
    const author = await Author.findByPk(id);
    if (!author) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    logger.info("authorControllers --> getAuthorsById --> ended");
    return successResponse(res, message.COMMON.FETCH_SUCCESS, author, 200);
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
  try {
    logger.info("authorControllers --> updateAuthors --> reached");

    const { id } = req.params;
    const { firstname, lastname, email } = req.body;
    const author = await Author.findByPk(id);
    if (!author) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    author.firstname = firstname;
    author.lastname = lastname;
    author.email = email;

    await author.save();

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
  try {
    logger.info("authorControllers --> deleteAuthors --> reached");

    const { id } = req.params;
    const author = await Author.findByPk(id);
    if (!author) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    await author.destroy();

    logger.info("authorControllers --> deleteAuthors --> ended");
    return successResponse(res, message.COMMON.DELETE_SUCCESS, author, 200);
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
