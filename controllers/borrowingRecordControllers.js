// MODELS
const { BorrowingRecord, Book } = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

// Create a new borrowing record
const createBorrowingRecord = async (req, res) => {
  try {
    logger.info(
      "borrowingRecordControllers --> createBorrowingRecord --> reached"
    );
    const { userId, bookId, borrowDate, dueDate } = req.body;

    const book = await Book.findByPk(bookId);

    if (!book || book.inventoryCount <= 0) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 400);
    }

    const responseData = await BorrowingRecord.create({
      userId,
      bookId,
      borrowDate,
      dueDate,
    });

    book.inventoryCount -= 1;
    await book.save();

    logger.info(
      "borrowingRecordControllers --> createBorrowingRecord --> ended"
    );
    return successResponse(
      res,
      message.COMMON.ADDED_SUCCESS,
      responseData,
      201
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

// Update borrowing record
const updateBorrowingRecord = async (req, res) => {
  try {
    logger.info(
      "borrowingRecordControllers --> updateBorrowingRecord --> reached"
    );
    const { id } = req.params;

    const record = await BorrowingRecord.findByPk(id);

    if (!record) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    const { returnDate } = req.body;
    record.returnDate = returnDate || record.returnDate;

    if (returnDate) {
      const book = await Book.findByPk(record.bookId);
      book.inventoryCount += 1;
      await book.save();
    }

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
  createBorrowingRecord,
  getAllBorrowingRecords,
  getBorrowingRecordById,
  updateBorrowingRecord,
  deleteBorrowingRecord,
};
