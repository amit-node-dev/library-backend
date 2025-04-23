const express = require("express");

// CONTROLLERS
const {
  registerUser,
  getAllUserList,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUserPoints,
} = require("../controllers/userControllers");

//  TO VALIDATE USER DATA TYPES WHILE CREATING NEW USER
const {
  newUserValidation,
  userUpdateValidation,
} = require("../middlewares/validations");
const checkRole = require("../middlewares/checkRole");

const router = express.Router();

const permission = ["super_admin", "admin", "librarian", "customer", "guest"];

router.post(
  "/add_users",
  checkRole(["super_admin"]),
  newUserValidation,
  registerUser
);

router.get("/", checkRole(permission), getAllUserList);

router.post("/get-points", getCurrentUserPoints);

router.get("/:id", checkRole(permission), getUserById);

router.put(
  "/:id",
  checkRole(["super_admin"]),
  userUpdateValidation,
  updateUser
);

router.delete("/:id", checkRole(["super_admin"]), deleteUser);

module.exports = router;
