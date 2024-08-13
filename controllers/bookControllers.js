// BOOK MODEL
const { Book, Author, Category, BookAuthor, sequelize } = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

// ADD NEW BOOKS
const addNewBooks = async (req, res) => {
  try {
    logger.info("bookControllers --> addNewBooks --> reached");

    const {
      bookname,
      title,
      authorIds,
      categoryId,
      description,
      conclusion,
      isbn,
      publisher,
      publication_year,
      total_copies,
      available_copies,
      location,
    } = req.body;

    const newBookData = await Book.create(
      {
        bookname,
        title,
        description,
        conclusion,
        isbn,
        publisher,
        publication_year,
        total_copies,
        available_copies,
        location,
        category: categoryId,
      },
      { include: [{ model: Category, as: "category" }] }
    );

    // Associating with Authors
    if (authorIds && authorIds.length > 0) {
      const authors = await Author.findAll({ where: { id: authorIds } });
      await newBookData.setAuthors(authors);
    }

    logger.info("bookControllers --> addNewBooks --> ended");
    return successResponse(res, message.COMMON.ADDED_SUCCESS, newBookData, 201);
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
  try {
    logger.info("bookControllers --> getAllBooksList --> reached");

    const { page = 1, pageSize = 5 } = req.query;
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize, 10);

    const { count, rows } = await Book.findAndCountAll({
      offset,
      limit,
      include: [
        {
          model: Author,
          as: "authors",
          attributes: ["firstname", "lastname"],
        },
        {
          model: Category,
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
  try {
    logger.info("bookControllers --> getBooksById --> reached");

    const { id } = req.params;
    const book = await Book.findByPk(id, {
      include: [
        { model: Author, as: "authors", attributes: ["firstname", "lastname"] },
        { model: Category, as: "category", attributes: ["name"] },
      ],
    });
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
  try {
    logger.info("bookControllers --> updateBooks --> reached");

    const { id } = req.params;
    const {
      bookname,
      title,
      authorIds,
      categoryId,
      description,
      conclusion,
      isbn,
      publisher,
      publication_year,
      total_copies,
      available_copies,
      location,
    } = req.body;
    const book = await Book.findByPk(id);
    if (!book) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    // Update book details
    await book.update({
      bookname,
      title,
      description,
      conclusion,
      isbn,
      publisher,
      publication_year,
      total_copies,
      available_copies,
      location,
      category: categoryId,
    });

    // Update authors association
    if (authorIds && authorIds.length > 0) {
      const authors = await Author.findAll({ where: { id: authorIds } });
      await book.setAuthors(authors);
    }

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
  try {
    logger.info("bookControllers --> deleteBooks --> reached");

    const { id } = req.params;
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
