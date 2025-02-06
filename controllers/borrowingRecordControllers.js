// MODELS
const { BorrowingRecord, Book, sequelize } = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

// GET BORROW BOOK RECORD STATUS
const getBorrowBookRecordStatus = async (req, res) => {
  try {
    logger.info(
      "borrowingRecordControllers --> getBorrowBookRecordStatus --> reached"
    );

    const { userId, bookId } = req.body;

    // Fetch the book details
    const book = await Book.findByPk(bookId);

    if (!book) {
      return errorResponse(res, "Book not found", null, 404);
    }

    // Check if book is out of stock
    if (book.available_copies <= 0) {
      return successResponse(res, "Out of Stock", null, 200);
    }

    // Fetch the most recent borrowing record for the given user & book
    const borrowRecord = await BorrowingRecord.findOne({
      where: { user_id: userId, book_id: bookId },
      order: [["id", "DESC"]],
    });

    // If no borrowing record exists for this user & book
    if (!borrowRecord) {
      return successResponse(res, "No borrowing record found", null, 200);
    }

    // Extract relevant details
    const responseData = {
      recordId: borrowRecord.id,
      borrowDate: borrowRecord.borrow_date,
      dueDate: borrowRecord.due_date,
      returnDate: borrowRecord.return_date || null,
      status: borrowRecord.status,
    };

    logger.info(
      "borrowingRecordControllers --> getBorrowBookRecordStatus --> ended"
    );
    return successResponse(
      res,
      message.COMMON.FETCH_SUCCESS,
      responseData,
      200
    );
  } catch (error) {
    logger.error(
      "borrowingRecordControllers --> getBorrowBookRecordStatus --> error",
      error
    );
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Add borrowing record of books
const addBorrowingRecord = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    logger.info(
      "borrowingRecordControllers --> addBorrowingRecord --> reached"
    );

    const { userId, bookId, borrowDate, dueDate, status } = req.body;

    // Fetch the book details
    const book = await Book.findByPk(bookId, { transaction });
    if (!book) {
      await transaction.rollback();
      return errorResponse(
        res,
        message.COMMON.NOT_FOUND,
        "Book not found",
        404
      );
    }

    if (book.available_copies <= 0) {
      await transaction.rollback();
      return errorResponse(res, "No copies available for borrowing", null, 400);
    }

    // Create borrowing record
    const borrowRecord = await BorrowingRecord.create(
      {
        user_id: userId,
        book_id: bookId,
        borrow_date: borrowDate,
        due_date: dueDate,
        status,
      },
      { transaction }
    );

    // Update book availability
    book.available_copies -= 1;
    await book.save({ transaction });

    await transaction.commit();

    logger.info("borrowingRecordControllers --> addBorrowingRecord --> ended");
    return successResponse(
      res,
      "Book borrowed successfully",
      borrowRecord,
      201
    );
  } catch (error) {
    logger.error(
      "borrowingRecordControllers --> addBorrowingRecord --> error",
      error
    );
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Return the borrowing record ofbook
const returnBorrowingRecord = async (req, res) => {
  try {
    logger.info(
      "borrowingRecordControllers --> returnBorrowingRecord --> reached"
    );

    const { recordId, userId, bookId, returnDate, status } = req.body;

    // Fetch the borrowing record
    const record = await BorrowingRecord.findOne({
      where: { id: recordId, user_id: userId, book_id: bookId },
    });

    if (!record) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    // Fetch the book details
    const book = await Book.findByPk(bookId);
    if (!book) {
      return errorResponse(res, "Book not found", null, 404);
    }

    const dueDate = new Date(record.due_date);
    const returnDateObj = new Date(returnDate);

    // Check if return date is past due date
    let warningMessage = null;
    if (returnDateObj > dueDate) {
      warningMessage = "Warning: The return date exceeds the due date.";
    }

    // Update book's available copies only if it's the first time returning
    if (!record.return_date) {
      book.available_copies += 1;
      await book.save();
    }

    // Update borrowing record details
    record.return_date = new Date(returnDate);
    record.status = status;

    await record.save();

    logger.info(
      "borrowingRecordControllers --> returnBorrowingRecord --> ended"
    );
    return successResponse(
      res,
      warningMessage || "Returned Successfully",
      { record, warning: warningMessage },
      200
    );
  } catch (error) {
    logger.error(
      "borrowingRecordControllers --> returnBorrowingRecord --> error",
      error
    );
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Get all borrowing records
const getAllBorrowingRecords = async (req, res) => {
  try {
    logger.info(
      "borrowingRecordControllers --> getAllBorrowingRecords --> reached"
    );

    const { page = 1, pageSize = 5, status } = req.query;
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize, 10);

    // Create the where clause based on the status query parameter
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await BorrowingRecord.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      include: ["users", "books"],
    });

    const responseData = {
      items: rows,
      totalCount: count,
      page: parseInt(page),
      pageSize: limit,
      itemsPerPage: Math.ceil(count / limit),
    };

    logger.info(
      "borrowingRecordControllers --> getAllBorrowingRecords --> ended"
    );
    return successResponse(
      res,
      message.COMMON.LIST_FETCH_SUCCESS,
      responseData,
      200
    );
  } catch (error) {
    logger.error(
      "borrowingRecordControllers --> getAllBorrowingRecords --> error",
      error
    );
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Get borrowing record by ID
const getBorrowingRecordById = async (req, res) => {
  try {
    logger.info(
      "borrowingRecordControllers --> getBorrowingRecordById --> reached"
    );

    const { id } = req.params;

    const record = await BorrowingRecord.findByPk(id);
    if (!record) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    logger.info(
      "borrowingRecordControllers --> getBorrowingRecordById --> ended"
    );
    return successResponse(res, message.COMMON.FETCH_SUCCESS, record, 200);
  } catch (error) {
    logger.error(
      "borrowingRecordControllers --> getBorrowingRecordById --> error",
      error
    );
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Update borrowing record of books
const updateBorrowingRecord = async (req, res) => {
  try {
    logger.info(
      "borrowingRecordControllers --> updateBorrowingRecord --> reached"
    );

    const { id } = req.params;
    const { returnDate, fineAmount, status } = req.body;

    const record = await BorrowingRecord.findByPk(id);
    if (!record) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    const book = await Book.findByPk(record.bookId);

    if (returnDate) {
      record.returnDate = returnDate;
      book.inventoryCount += 1;
      await book.save();
    }

    if (fineAmount) record.fineAmount = fineAmount;
    if (status) record.status = status;

    await record.save();

    logger.info(
      "borrowingRecordControllers --> updateBorrowingRecord --> ended"
    );
    return successResponse(res, message.COMMON.UPDATE_SUCCESS, record, 200);
  } catch (error) {
    logger.error(
      "borrowingRecordControllers --> updateBorrowingRecord --> error",
      error
    );
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Delete borrowing record
const deleteBorrowingRecord = async (req, res) => {
  try {
    logger.info(
      "borrowingRecordControllers --> deleteBorrowingRecord --> reached"
    );

    const { id } = req.params;

    const record = await BorrowingRecord.findByPk(id);
    if (!record) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    const book = await Book.findByPk(record.id);
    book.inventoryCount += 1;

    await book.save();
    await record.destroy();

    logger.info(
      "borrowingRecordControllers --> deleteBorrowingRecord --> ended"
    );
    return successResponse(res, message.COMMON.DELETE_SUCCESS, record, 200);
  } catch (error) {
    logger.error(
      "borrowingRecordControllers --> deleteBorrowingRecord --> error",
      error
    );
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

module.exports = {
  addBorrowingRecord,
  getBorrowBookRecordStatus,
  getBorrowingRecordById,
  returnBorrowingRecord,
  getAllBorrowingRecords,
  updateBorrowingRecord,
  deleteBorrowingRecord,
};
