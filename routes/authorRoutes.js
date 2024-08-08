const express = require("express");

// CONTROLLERS
const {
  addNewAuthors,
  getAllAuthorsList,
  getAuthorsById,
  updateAuthors,
  deleteAuthors,
} = require("../controllers/authorControllers");

//  TO VALIDATE AUTH AUTHORS DATA
const {
  validateNewAuthor,
  validatePrevAuthor,
} = require("../middlewares/validations");
const checkRole = require("../middlewares/checkRole");

const router = express.Router();

const permission = ["super_admin", "admin", "customer"];

// Private routes (require authentication)
router.post(
  "/add_authors",
  checkRole(["super_admin"]),
  validateNewAuthor,
  addNewAuthors
);

router.get("/", checkRole(permission), getAllAuthorsList);

router.get("/:id", checkRole(permission), getAuthorsById);

router.put(
  "/:id",
  checkRole(["super_admin"]),
  validatePrevAuthor,
  updateAuthors
);

router.delete("/:id", checkRole(["super_admin"]), deleteAuthors);

module.exports = router;
