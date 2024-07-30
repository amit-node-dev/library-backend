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
const checkRole = require("../middlewares/checkRole");

const router = express.Router();

// Private routes (require authentication)
router.post(
  "/add_authors",
  checkRole(["super_admin", "admin"]),
  validateNewAuthor,
  addNewAuthors
);

router.get(
  "/",
  checkRole(["super_admin", "admin", "super_agent", "agent"]),
  getAllAuthorsList
);

router.get(
  "/:id",
  checkRole(["super_admin", "admin", "super_agent", "agent"]),
  getAuthorsById
);

router.put(
  "/:id",
  checkRole(["super_admin"]),
  validatePrevAuthor,
  updateAuthors
);

router.delete("/:id", checkRole(["super_admin"]), deleteAuthors);

module.exports = router;
