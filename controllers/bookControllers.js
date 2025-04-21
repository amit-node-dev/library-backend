const { Op } = require("sequelize");

// BOOK MODEL
const { Book, Author, Category, BookAuthor, sequelize } = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

// ADD NEW BOOKS
const addNewBooks = async (req, res) => {
  const transaction = await Book.sequelize.transaction();
  try {
    logger.info("bookControllers --> addNewBooks --> reached");

    const {
      bookname,
      title,
      authorId,
      categoryId,
      description,
      conclusion,
      isbn,
      publisher,
      publicationYear,
      totalCopies,
      location,
      pointsRequired,
    } = req.body;

    // Validate authorId
    const authorExists = await Author.findByPk(authorId, { transaction });
    if (!authorExists) {
      await transaction.rollback();
      return errorResponse(res, "Author not found", null, 400);
    }

    // Validate categoryId
    const categoryExists = await Category.findByPk(categoryId, { transaction });
    if (!categoryExists) {
      await transaction.rollback();
      return errorResponse(res, "Category not found", null, 400);
    }

    // Convert numeric fields
    const parsedTotalCopies = totalCopies ? parseInt(totalCopies, 10) : null;
    const parsedPublicationYear = publicationYear
      ? parseInt(publicationYear, 10)
      : null;
    const parsedPointsRequired = pointsRequired
      ? parseInt(pointsRequired, 10)
      : null;

    // Create new book
    const newBookData = await Book.create(
      {
        bookname,
        title,
        description,
        conclusion,
        isbn,
        publisher,
        publication_year: parsedPublicationYear,
        total_copies: parsedTotalCopies,
        available_copies: parsedTotalCopies,
        location,
        category_id: categoryId,
        author_id: authorId,
        points_required: parsedPointsRequired,
      },
      { transaction }
    );

    await transaction.commit();

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

    const {
      page = 1,
      pageSize = 10,
      search = "",
      category = "",
      author = "",
    } = req.query;
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize, 10);

    // Building the where condition
    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { isbn: { [Op.like]: `%${search}%` } },
        { bookName: { [Op.like]: `%${search}%` } },
        { publisher: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
      ];
    }

    if (category) {
      whereCondition.categoryId = category;
    }

    if (author) {
      whereCondition.authorId = author;
    }

    const { count, rows } = await Book.findAndCountAll({
      where: whereCondition,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Author,
          as: "author",
          attributes: ["firstName", "lastName"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
      ],
    });

    const responseData = {
      items: rows,
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
      message.SERVER.INTERNAL_ERROR,
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

    // Validate if ID is a valid number
    if (!id || isNaN(id)) {
      return errorResponse(res, "Invalid Book ID provided", null, 400);
    }

    const book = await Book.findByPk(id, {
      include: [
        {
          model: Author,
          as: "author",
          attributes: ["id", "firstname", "lastname"],
        },
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
    });

    // If book not found, return 404
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
  const transaction = await Book.sequelize.transaction();
  try {
    logger.info("bookControllers --> updateBooks --> reached");

    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return errorResponse(res, "Invalid Book ID provided", null, 400);
    }

    const {
      bookname,
      title,
      authorId,
      categoryId,
      description,
      conclusion,
      isbn,
      publisher,
      publicationYear,
      totalCopies,
      location,
      pointsRequired,
    } = req.body;

    // Check if the book exists
    const book = await Book.findByPk(id, { transaction });
    if (!book) {
      await transaction.rollback();
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    // Validate authorId & categoryId existence
    if (authorId) {
      const authorExists = await Author.findByPk(authorId, { transaction });
      if (!authorExists) {
        await transaction.rollback();
        return errorResponse(res, "Author not found", null, 400);
      }
    }

    if (categoryId) {
      const categoryExists = await Category.findByPk(categoryId, {
        transaction,
      });
      if (!categoryExists) {
        await transaction.rollback();
        return errorResponse(res, "Category not found", null, 400);
      }
    }

    // Update book details
    await book.update(
      {
        bookname,
        title,
        description,
        conclusion,
        isbn,
        publisher,
        publication_year: publicationYear ? parseInt(publicationYear) : null,
        total_copies: totalCopies ? parseInt(totalCopies) : null,
        location,
        category_id: categoryId,
        author_id: authorId,
        points_required: pointsRequired ? parseInt(pointsRequired) : null,
      },
      { transaction }
    );

    await transaction.commit();

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
  const transaction = await Book.sequelize.transaction();
  try {
    logger.info("bookControllers --> deleteBooks --> reached");

    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return errorResponse(res, "Invalid Book ID provided", null, 400);
    }

    // Check if book exists
    const book = await Book.findByPk(id, { transaction });
    if (!book) {
      await transaction.rollback();
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    // Perform delete operation
    await book.destroy({ transaction });

    await transaction.commit();

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
