const express = require("express");

// CONTROLLERS
const {
  getAllUserList,
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controllers/userControllers");

//  TO VALIDATE USER DATA TYPES WHILE CREATING NEW USER
const {
  validateNewUser,
  validatePrevUser,
} = require("../middlewares/validations");

const router = express.Router();

// Private routes (require authentication)
router.post("/add_user", validateNewUser, createUser);

router.get("/", getAllUserList);

router.get("/:id", getUserById);

router.put("/:id", validatePrevUser, updateUser);

router.delete("/:id", deleteUser);

module.exports = router;
