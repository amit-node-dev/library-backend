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

router.post(
  "/add_users",
  checkRole(["super_admin", "admin"]),
  validateNewUser,
  createUser
);

router.get(
  "/",
  checkRole(["super_admin", "admin", "super_agent", "agent"]),
  getAllUserList
);

router.get(
  "/:id",
  checkRole(["super_admin", "admin", "super_agent", "agent"]),
  getUserById
);

router.put("/:id", checkRole(["super_admin"]), validatePrevUser, updateUser);

router.delete("/:id", checkRole(["super_admin"]), deleteUser);

module.exports = router;
