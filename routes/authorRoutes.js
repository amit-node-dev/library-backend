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
const checkRole = require("../middlewares/checkRole");

const router = express.Router();

const permission = ["super_admin", "admin", "customer"];

// Private routes (require authentication)
router.post("/add-author", checkRole(["super_admin"]), addNewAuthors);

router.get("/", checkRole(permission), getAllAuthorsList);

router.get("/:id", checkRole(permission), getAuthorsById);

router.put("/:id", checkRole(["super_admin"]), updateAuthors);

router.delete("/:id", checkRole(["super_admin"]), deleteAuthors);

module.exports = router;
