const express = require("express");

// CONTROLLERS
const {
  addNewBooks,
  getAllBooksList,
  getBooksById,
  updateBooks,
  deleteBooks,
} = require("../controllers/bookControllers");

// MIDDLEWARE
const { validateBookField } = require("../middlewares/validations");

const router = express.Router();

// Private routes (require authentication)
router.post("/add_books", validateBookField, addNewBooks);

router.get("/", getAllBooksList);

router.get("/:id", getBooksById);

router.put("/:id", validateBookField, updateBooks);

router.delete("/:id", deleteBooks);

module.exports = router;
