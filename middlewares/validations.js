const { body, validationResult } = require("express-validator");

// MODELS
const { User, BorrowingRecord, Author } = require("../models");

// UTIL MODULES
const Messages = require("../utils/commonMessages");
const { errorResponse } = require("../utils/handleResponse");

/**
 * Common validation handler
 */
const validate = (validations) => {
  return [
    ...validations,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(
          res,
          Messages.VALIDATION.VALIDATION_ERROR,
          errors.array(),
          400
        );
      }
      next();
    },
  ];
};

/**
 * Auth validation rules
 */
const authValidation = validate([
  body("email")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.EMAIL_REQUIRED)
    .isEmail()
    .withMessage(Messages.VALIDATION.INVALID_EMAIL),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.PASSWORD_REQUIRED)
    .isLength({ min: 8 })
    .withMessage(Messages.VALIDATION.PASSWORD_MIN_LENGTH),
]);

/**
 * New user registration validation
 */
const newUserValidation = validate([
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.FIRSTNAME_REQUIRED)
    .isLength({ max: 50 })
    .withMessage(Messages.VALIDATION.FIRSTNAME_MAX_LENGTH),
  body("lastname")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.LASTNAME_REQUIRED)
    .isLength({ max: 50 })
    .withMessage(Messages.VALIDATION.LASTNAME_MAX_LENGTH),
  body("email")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.EMAIL_REQUIRED)
    .isEmail()
    .withMessage(Messages.VALIDATION.INVALID_EMAIL)
    .custom(async (email) => {
      const user = await User.findOne({ where: { email } });
      if (user) {
        throw new Error(Messages.AUTH.USER_EXISTS);
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.PASSWORD_REQUIRED)
    .isLength({ min: 8 })
    .withMessage(Messages.VALIDATION.PASSWORD_MIN_LENGTH)
    .matches(/[A-Z]/)
    .withMessage(Messages.VALIDATION.PASSWORD_UPPERCASE)
    .matches(/[a-z]/)
    .withMessage(Messages.VALIDATION.PASSWORD_LOWERCASE)
    .matches(/[0-9]/)
    .withMessage(Messages.VALIDATION.PASSWORD_NUMBER)
    .matches(/[^A-Za-z0-9]/)
    .withMessage(Messages.VALIDATION.PASSWORD_SPECIAL_CHAR),
  body("mobileNumber")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.MOBILE_REQUIRED)
    .isMobilePhone()
    .withMessage(Messages.VALIDATION.INVALID_MOBILE),
]);

/**
 * Existing user update validation
 */
const userUpdateValidation = validate([
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.FIRSTNAME_REQUIRED)
    .isLength({ max: 50 })
    .withMessage(Messages.VALIDATION.FIRSTNAME_MAX_LENGTH),
  body("lastname")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.LASTNAME_REQUIRED)
    .isLength({ max: 50 })
    .withMessage(Messages.VALIDATION.LASTNAME_MAX_LENGTH),
  body("email")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.EMAIL_REQUIRED)
    .isEmail()
    .withMessage(Messages.VALIDATION.INVALID_EMAIL),
  body("password")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage(Messages.VALIDATION.PASSWORD_MIN_LENGTH),
]);

/**
 * Role validation rules
 */
const roleValidation = validate([
  body("name")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.ROLE_NAME_REQUIRED)
    .isLength({ max: 30 })
    .withMessage(Messages.VALIDATION.ROLE_NAME_MAX_LENGTH),
]);

/**
 * Book validation rules
 */
const bookValidation = validate([
  body("bookname")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.BOOK_NAME_REQUIRED)
    .isLength({ max: 100 })
    .withMessage(Messages.VALIDATION.BOOK_NAME_MAX_LENGTH),
  body("description")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.DESCRIPTION_REQUIRED)
    .isLength({ max: 1000 })
    .withMessage(Messages.VALIDATION.DESCRIPTION_MAX_LENGTH),
  body("authorId")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.AUTHOR_REQUIRED)
    .isInt({ gt: 0 })
    .withMessage(Messages.VALIDATION.INVALID_AUTHOR_ID)
    .custom(async (authorId) => {
      const author = await Author.findByPk(authorId);
      if (!author) {
        throw new Error(Messages.VALIDATION.AUTHOR_NOT_FOUND);
      }
    }),
]);

/**
 * Fine validation rules
 */
const fineValidation = validate([
  body("user_id")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.USER_ID_REQUIRED)
    .isInt({ gt: 0 })
    .withMessage(Messages.VALIDATION.INVALID_USER_ID)
    .custom(async (userId) => {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error(Messages.VALIDATION.USER_NOT_FOUND);
      }
    }),
  body("record_id")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.RECORD_ID_REQUIRED)
    .isInt({ gt: 0 })
    .withMessage(Messages.VALIDATION.INVALID_RECORD_ID)
    .custom(async (recordId) => {
      const record = await BorrowingRecord.findByPk(recordId);
      if (!record) {
        throw new Error(Messages.VALIDATION.RECORD_NOT_FOUND);
      }
    }),
  body("fine_amount")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.FINE_AMOUNT_REQUIRED)
    .isFloat({ min: 0 })
    .withMessage(Messages.VALIDATION.INVALID_FINE_AMOUNT),
  body("fine_date")
    .trim()
    .notEmpty()
    .withMessage(Messages.VALIDATION.FINE_DATE_REQUIRED)
    .isISO8601()
    .withMessage(Messages.VALIDATION.INVALID_DATE_FORMAT)
    .toDate(),
]);

module.exports = {
  authValidation,
  newUserValidation,
  userUpdateValidation,
  roleValidation,
  bookValidation,
  fineValidation,
};
