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
const checkRole = require("../middlewares/checkRole");

const permission = ["super_admin", "admin", "customer"];

const router = express.Router();

// Private routes (require authentication)
router.post(
  "/add_books",
  checkRole(["super_admin"]),
  validateBookField,
  addNewBooks
);

router.get("/", checkRole(permission), getAllBooksList);

router.get("/:id", checkRole(permission), getBooksById);

router.put("/:id", checkRole(["super_admin"]), validateBookField, updateBooks);

router.delete("/:id", checkRole(["super_admin"]), deleteBooks);

module.exports = router;
