const { body, validationResult } = require("express-validator");

// MODELS
const { User, Author, BorrowingRecord } = require("../models");

// UTIL MODULES
const message = require("../utils/commonMessages");
const { errorResponse } = require("../utils/handleResponse");

const validateAuth = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        message.AUTH.INVALID_FORMAT,
        errors.array(),
        400
      );
    }
    next();
  },
];

const validateNewUser = [
  body("firstname")
    .isAlpha()
    .withMessage("Firstname must contain only letters"),
  body("lastname").isAlpha().withMessage("Lastname must contain only letters"),
  body("email")
    .isEmail()
    .withMessage("Email is invalid")
    .custom(async (email) => {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error("Email already in use");
      }
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        message.AUTH.INVALID_FORMAT,
        errors.array(),
        400
      );
    }
    next();
  },
];

const validatePrevUser = [
  body("firstname")
    .isAlpha()
    .withMessage("Firstname must contain only letters"),
  body("lastname").isAlpha().withMessage("Lastname must contain only letters"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        message.AUTH.INVALID_FORMAT,
        errors.array(),
        400
      );
    }
    next();
  },
];

const validateRole = [
  body("name").notEmpty().withMessage("Role name is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        message.AUTH.INVALID_FORMAT,
        errors.array(),
        400
      );
    }
    next();
  },
];

const validateBookField = [
  body("bookname")
    .notEmpty()
    .withMessage("Book name is required")
    .isString()
    .withMessage("Book name must be a string"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  body("authorId")
    .notEmpty()
    .withMessage("Author ID is required")
    .isAlphanumeric()
    .withMessage("Author ID must be alphanumeric"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        message.AUTH.INVALID_FORMAT,
        errors.array(),
        400
      );
    }
    next();
  },
];

const validateNewAuthor = [
  body("firstname")
    .isAlpha()
    .withMessage("Firstname must contain only letters"),
  body("lastname").isAlpha().withMessage("Lastname must contain only letters"),
  body("email")
    .isEmail()
    .withMessage("Email is invalid")
    .custom(async (email) => {
      const existingAuthUser = await Author.findOne({ where: { email } });
      if (existingAuthUser) {
        throw new Error("Email already in use");
      }
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        message.AUTH.INVALID_FORMAT,
        errors.array(),
        400
      );
    }
    next();
  },
];

const validatePrevAuthor = [
  body("firstname")
    .isAlpha()
    .withMessage("Firstname must contain only letters"),
  body("lastname").isAlpha().withMessage("Lastname must contain only letters"),
  body("email").isEmail().withMessage("Invalid email format"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        message.AUTH.INVALID_FORMAT,
        errors.array(),
        400
      );
    }
    next();
  },
];

// Validation for creating and updating Fine records
const validateFine = [
  body("user_id")
    .isInt({ gt: 0 })
    .withMessage("User ID must be a positive integer")
    .notEmpty()
    .withMessage("User ID is required")
    .custom(async (user_id) => {
      const user = await User.findByPk(user_id);
      if (!user) {
        throw new Error("User not found");
      }
    }),
  body("record_id")
    .isInt({ gt: 0 })
    .withMessage("Record ID must be a positive integer")
    .notEmpty()
    .withMessage("Record ID is required")
    .custom(async (record_id) => {
      const record = await BorrowingRecord.findByPk(record_id);
      if (!record) {
        throw new Error("Borrowing record not found");
      }
    }),
  body("fine_amount")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("Fine amount must be a decimal with up to two decimal places")
    .notEmpty()
    .withMessage("Fine amount is required"),
  body("fine_date")
    .isISO8601()
    .withMessage("Fine date must be a valid ISO8601 date format")
    .notEmpty()
    .withMessage("Fine date is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateAuth,
  validateNewUser,
  validatePrevUser,
  validateRole,
  validateBookField,
  validateNewAuthor,
  validatePrevAuthor,
  validateFine,
};
