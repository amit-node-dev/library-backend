const express = require("express");

// CONTROLLERS
const {
  addNewAuthors,
  getAllAuthorsList,
  getAuthorsById,
  updateAuthors,
  deleteAuthors,
} = require("../controllers/authorControllers");

//  TO VALIDATE USER DATA TYPES WHILE CREATING NEW USER
const {
  validateNewUser,
  validatePrevUser,
} = require("../middlewares/validations");

const router = express.Router();

// Private routes (require authentication)
router.post("/add_books", validateNewUser, addNewAuthors);

router.get("/", getAllAuthorsList);

router.get("/:id", getAuthorsById);

router.put("/:id", validatePrevUser, updateAuthors);

router.delete("/:id", deleteAuthors);

module.exports = router;
