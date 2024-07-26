const { body, validationResult } = require("express-validator");

// MODELS
const { User } = require("../models");
const { Author } = require("../models");

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

module.exports = {
  validateAuth,
  validateNewUser,
  validatePrevUser,
  validateBookField,
  validateNewAuthor,
  validatePrevAuthor,
};
