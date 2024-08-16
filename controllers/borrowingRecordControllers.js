// MODELS
const { BorrowingRecord, Book } = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

// Add borrowing record of books
const addBorrowingRecord = async (req, res) => {
  try {
    logger.info(
      "borrowingRecordControllers --> addBorrowingRecord --> reached"
    );

    const { userId, bookId, borrowDate, dueDate } = req.body;

    const book = await Book.findByPk(bookId);
    if (!book || book.available_copies <= 0) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 400);
    }

    const responseData = await BorrowingRecord.create({
      user_id: userId,
      book_id: bookId,
      borrow_date: borrowDate,
      due_date: dueDate,
    });

    book.available_copies -= 1;
    await book.save();

    logger.info("borrowingRecordControllers --> addBorrowingRecord --> ended");
    return successResponse(
      res,
      message.COMMON.ADDED_SUCCESS,
      responseData,
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

// GET BORROW BOOK RECORD STATUS
const getBorrowBookRecordStatus = async (req, res) => {
  try {
    logger.info(
      "borrowingRecordControllers --> getBorrowBookRecordStatus --> reached"
    );

    const { userId, bookId } = req.body;

    // Fetch the borrowing record based on userId and bookId
    const borrowRecord = await BorrowingRecord.findOne({
      where: {
        user_id: userId,
        book_id: bookId,
      },
    });

    if (!borrowRecord) {
      return successResponse(res, message.COMMON.NOT_FOUND, null, 200);
    }

    // Check if the book is still borrowed
    const currentDate = new Date();
    const borrowDate = new Date(borrowRecord.borrow_date);
    const dueDate = new Date(borrowRecord.due_date);
    const returnDate = borrowRecord.return_date
      ? new Date(borrowRecord.return_date)
      : null;

    // Determine the borrow status
    let status = "unknown";

    if (currentDate >= borrowDate && currentDate <= dueDate) {
      status = "borrowed";
    } else if (returnDate) {
      status = "returned";
    } else if (currentDate > dueDate) {
      status = "overdue";
    }

    const responseData = {
      borrowDate,
      dueDate,
      returnDate,
      status,
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

// Return the borrowing record ofbook
const returnBorrowingRecord = async (req, res) => {
  try {
    logger.info(
      "borrowingRecordControllers --> returnBorrowingRecord --> reached"
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
      "borrowingRecordControllers --> returnBorrowingRecord --> ended"
    );
    return successResponse(res, message.COMMON.UPDATE_SUCCESS, record, 200);
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
      "borrowingRecordControllers --> createBorrowingRecord --> reached"
    );

    const records = await BorrowingRecord.findAll({
      include: ["user", "book"],
    });

    logger.info(
      "borrowingRecordControllers --> createBorrowingRecord --> ended"
    );
    return successResponse(
      res,
      message.COMMON.LIST_FETCH_SUCCESS,
      records,
      200
    );
  } catch (error) {
    logger.error(
      "borrowingRecordControllers --> createBorrowingRecord --> error",
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

    const record = await BorrowingRecord.findByPk(id, {
      include: ["user", "book"],
    });
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
  getAllBorrowingRecords,
  getBorrowingRecordById,
  updateBorrowingRecord,
  deleteBorrowingRecord,
};
