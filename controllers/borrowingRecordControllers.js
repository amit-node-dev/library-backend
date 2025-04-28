const jwt = require("jsonwebtoken");

// MODELS
const {
  BorrowingRecord,
  Book,
  sequelize,
  User,
  Role,
  Penalty,
} = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const Message = require("../utils/commonMessages");

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
    if (book.availableCopies <= 0) {
      return successResponse(res, "Out of Stock", null, 200);
    }

    // Fetch the most recent borrowing record for the given user & book
    const borrowRecord = await BorrowingRecord.findOne({
      where: { userId, bookId },
      order: [["id", "DESC"]],
    });

    // If no borrowing record exists for this user & book
    if (!borrowRecord) {
      return successResponse(res, "No borrowing record found", null, 200);
    }

    // Extract relevant details
    const responseData = {
      recordId: borrowRecord.id,
      borrowDate: borrowRecord.borrowDate,
      dueDate: borrowRecord.dueDate,
      returnDate: borrowRecord.returnDate || null,
      status: borrowRecord.status,
    };

    logger.info(
      "borrowingRecordControllers --> getBorrowBookRecordStatus --> ended"
    );
    return successResponse(
      res,
      Message.COMMON.FETCH_SUCCESS,
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
      Message.SERVER.INTERNAL_ERROR,
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

    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { emailId } = decoded;

    // Validate if User exists and is active
    const user = await User.findOne({
      where: { emailId },
      include: [{ model: Role, as: "role" }],
      transaction,
    });

    if (!user) {
      return errorResponse(res, "User not found or inactive.", null, 404);
    }

    // Check role-based access
    const allowedRoles = [
      "super_admin",
      "admin",
      "librarian",
      "customer",
      "guest",
    ];
    if (!allowedRoles.includes(user.role?.name)) {
      await transaction.rollback();
      return errorResponse(
        res,
        "You are not authorized to access this resource.",
        null,
        401
      );
    }

    const { userId, bookId, borrowDate, dueDate, status } = req.body;

    // Fetch the book details
    const book = await Book.findByPk(bookId, { transaction });
    if (!book) {
      await transaction.rollback();
      return errorResponse(res, Message.COMMON.NOT_FOUND, null, 404);
    }

    if (book.availableCopies <= 0) {
      await transaction.rollback();
      return successResponse(
        res,
        "No copies available for borrowing",
        null,
        200
      );
    }

    // Check if user has enough points
    if (user.points < book.pointsRequired) {
      await transaction.rollback();
      return successResponse(
        res,
        "Not enough points to borrow this book",
        null,
        200
      );
    }

    // Deduct points from user
    user.points -= book.pointsRequired;
    await user.save({ transaction });

    // Create borrowing record
    const borrowRecord = await BorrowingRecord.create(
      {
        userId,
        bookId,
        borrowDate,
        dueDate,
        status,
      },
      { transaction }
    );

    // Update book availability
    book.availableCopies -= 1;
    await book.save({ transaction });

    await transaction.commit();

    logger.info("borrowingRecordControllers --> addBorrowingRecord --> ended");
    return successResponse(
      res,
      "Book borrowed successfully. Points deducted.",
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
      Message.SERVER.INTERNAL_ERROR,
      error.message,
      500
    );
  }
};

// Return the borrowing record ofbook
const returnBorrowingRecord = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    logger.info(
      "borrowingRecordControllers --> returnBorrowingRecord --> reached"
    );

    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { emailId } = decoded;

    // Validate if User exists and is active
    const user = await User.findOne({
      where: { emailId },
      include: [{ model: Role, as: "role" }],
      transaction,
    });

    if (!user) {
      return errorResponse(res, "User not found or inactive.", null, 404);
    }

    // Check role-based access
    const allowedRoles = [
      "super_admin",
      "admin",
      "librarian",
      "customer",
      "guest",
    ];
    if (!allowedRoles.includes(user.role?.name)) {
      await transaction.rollback();
      return errorResponse(
        res,
        "You are not authorized to access this resource.",
        null,
        403
      );
    }

    const { recordId, userId, bookId, returnDate, status } = req.body;

    // Fetch the borrowing record
    const record = await BorrowingRecord.findOne({
      where: { id: recordId, userId, bookId },
      transaction,
    });

    if (!record) {
      await transaction.rollback();
      return errorResponse(res, Message.COMMON.NOT_FOUND, null, 404);
    }

    // Fetch the book details
    const book = await Book.findByPk(bookId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!book) {
      await transaction.rollback();
      return errorResponse(res, "Book not found", null, 404);
    }

    const dueDate = new Date(record.due_date);
    const returnDateObj = new Date(returnDate);

    let warningMessage = null;
    let penaltyCreated = false;
    let fineAmount = 0;

    // Check if return date is past due date
    if (returnDateObj > dueDate) {
      warningMessage =
        "Warning: The return date exceeds the due date. Fine has been applied.";

      // Calculate fine (30% of book's `points_required`, rounded)
      fineAmount = book.points_required
        ? Math.round(book.points_required * 0.3)
        : 0;

      // Create a new penalty entry
      await Penalty.create(
        {
          userId,
          bookId,
          fineAmount,
        },
        { transaction }
      );

      penaltyCreated = true;
    }

    // Deduct fine from user's points
    if (fineAmount > 0) {
      user.points = Math.max(0, user.points - fineAmount);
      await user.save({ transaction });
    }

    // Update book's available copies only if it's the first time returning
    if (!record.returnDate) {
      book.availableCopies += 1;
      await book.save({ transaction });
    }

    // Update borrowing record details
    record.returnDate = returnDateObj;
    record.status = status;
    await record.save({ transaction });

    await transaction.commit();

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
      Message.SERVER.INTERNAL_ERROR,
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
      include: ["user", "book"],
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
      Message.COMMON.LIST_FETCH_SUCCESS,
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
      Message.SERVER.INTERNAL_ERROR,
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
      return errorResponse(res, Message.COMMON.NOT_FOUND, null, 404);
    }

    logger.info(
      "borrowingRecordControllers --> getBorrowingRecordById --> ended"
    );
    return successResponse(res, Message.COMMON.FETCH_SUCCESS, record, 200);
  } catch (error) {
    logger.error(
      "borrowingRecordControllers --> getBorrowingRecordById --> error",
      error
    );
    return errorResponse(
      res,
      Message.SERVER.INTERNAL_ERROR,
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
      return errorResponse(res, Message.COMMON.NOT_FOUND, null, 404);
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
    return successResponse(res, Message.COMMON.UPDATE_SUCCESS, record, 200);
  } catch (error) {
    logger.error(
      "borrowingRecordControllers --> updateBorrowingRecord --> error",
      error
    );
    return errorResponse(
      res,
      Message.SERVER.INTERNAL_ERROR,
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
      return errorResponse(res, Message.COMMON.NOT_FOUND, null, 404);
    }

    const book = await Book.findByPk(record.id);
    book.inventoryCount += 1;

    await book.save();
    await record.destroy();

    logger.info(
      "borrowingRecordControllers --> deleteBorrowingRecord --> ended"
    );
    return successResponse(res, Message.COMMON.DELETE_SUCCESS, record, 200);
  } catch (error) {
    logger.error(
      "borrowingRecordControllers --> deleteBorrowingRecord --> error",
      error
    );
    return errorResponse(
      res,
      Message.SERVER.INTERNAL_ERROR,
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
