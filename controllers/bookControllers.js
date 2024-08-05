// BOOK MODEL
const { Book, sequelize } = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

// ADD NEW BOOKS
const addNewBooks = async (req, res) => {
  try {
    logger.info("bookControllers --> addNewBooks --> reached");
    const { bookname, title, authorId, categoryId, description, conclusion } =
      req.body;

    const responseData = await Book.create({
      bookname,
      title,
      authorId,
      categoryId,
      description,
      conclusion,
    });

    logger.info("bookControllers --> addNewBooks --> ended");
    return successResponse(
      res,
      message.COMMON.ADDED_SUCCESS,
      responseData,
      201
    );
  } catch (error) {
    logger.error("bookControllers --> addNewBooks --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// GET ALL LIST OF BOOKS WITH PAGINATION
const getAllBooksList = async (req, res) => {
  const { page = 1, pageSize = 5 } = req.query;

  try {
    logger.info("bookControllers --> getAllBooksList --> reached");

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize, 10);

    const { count, rows } = await Book.findAndCountAll({
      offset,
      limit,
      include: [
        {
          model: sequelize.models.Author,
          as: "author",
          attributes: ["firstname", "lastname"],
        },
        {
          model: sequelize.models.Category,
          as: "category",
          attributes: ["name"],
        },
      ],
    });

    const responseData = {
      books: rows,
      total: count,
      page: parseInt(page, 10),
      pageSize: limit,
    };

    logger.info("bookControllers --> getAllBooksList --> ended");
    return successResponse(
      res,
      message.COMMON.LIST_FETCH_SUCCESS,
      responseData,
      200
    );
  } catch (error) {
    logger.error("bookControllers --> getAllBooksList --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// GET BOOKS BY ID
const getBooksById = async (req, res) => {
  logger.info("bookControllers --> getBooksById --> reached");
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id);

    if (!book) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    logger.info("bookControllers --> getBooksById --> ended");

    return successResponse(res, message.COMMON.FETCH_SUCCESS, book, 200);
  } catch (error) {
    logger.error("bookControllers --> getBooksById --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// UPDATE BOOKS BY ID
const updateBooks = async (req, res) => {
  logger.info("bookControllers --> updateBooks --> reached");
  const { id } = req.params;
  const { bookname, title, authorId, categoryId, description, conclusion } =
    req.body;
  try {
    const book = await Book.findByPk(id);

    if (!book) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    book.bookname = bookname;
    book.title = title;
    book.authorId = authorId;
    book.categoryId = categoryId;
    book.description = description;
    book.conclusion = conclusion;

    await book.save();

    logger.info("bookControllers --> updateBooks --> ended");
    return successResponse(res, message.COMMON.UPDATE_SUCCESS, book, 200);
  } catch (error) {
    logger.error("bookControllers --> updateBooks --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// DELETE BOOKS BY ID
const deleteBooks = async (req, res) => {
  logger.info("bookControllers --> deleteBooks --> reached");
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id);

    if (!book) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    await book.destroy();

    logger.info("bookControllers --> deleteBooks --> ended");
    return successResponse(res, message.COMMON.DELETE_SUCCESS, book, 200);
  } catch (error) {
    logger.error("bookControllers --> deleteBooks --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

module.exports = {
  addNewBooks,
  getAllBooksList,
  getBooksById,
  updateBooks,
  deleteBooks,
};
