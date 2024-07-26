const express = require("express");

// CONTROLLERS
const {
  addNewAuthors,
  getAllAuthorsList,
  getAuthorsById,
  updateAuthors,
  deleteAuthors,
} = require("../controllers/authorControllers");

//  TO VALIDATE AUTH USER DATA TYPES WHILE CREATING NEW USER
const {
  validateNewAuthor,
  validatePrevAuthor,
} = require("../middlewares/validations");

const router = express.Router();

// Private routes (require authentication)
router.post("/add_authors", validateNewAuthor, addNewAuthors);

router.get("/", getAllAuthorsList);

router.get("/:id", getAuthorsById);

router.put("/:id", validatePrevAuthor, updateAuthors);

router.delete("/:id", deleteAuthors);

module.exports = router;
