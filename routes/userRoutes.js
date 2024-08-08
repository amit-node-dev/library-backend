const express = require("express");

// CONTROLLERS
const {
  createUser,
  getAllUserList,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");

//  TO VALIDATE USER DATA TYPES WHILE CREATING NEW USER
const {
  validateNewUser,
  validatePrevUser,
} = require("../middlewares/validations");
const checkRole = require("../middlewares/checkRole");

const router = express.Router();

const permission = ["super_admin", "admin", "customer"];

router.post(
  "/add_users",
  checkRole(["super_admin"]),
  validateNewUser,
  createUser
);

router.get("/", checkRole(permission), getAllUserList);

router.get("/:id", checkRole(permission), getUserById);

router.put("/:id", checkRole(["super_admin"]), validatePrevUser, updateUser);

router.delete("/:id", checkRole(["super_admin"]), deleteUser);

module.exports = router;
