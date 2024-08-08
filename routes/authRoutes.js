const express = require("express");

// CONTROLLERS
const {
  loginUser,
  logoutUser,
  sentOTP,
  verifyOTP,
} = require("../controllers/authControllers");

// MIDDLEWARE MODULE
const { validateAuth, validateNewUser } = require("../middlewares/validations");
const { createUser } = require("../controllers/userControllers");

const router = express.Router();

router.post("/login", validateAuth, loginUser);

router.post("/logout", logoutUser);

router.post("/register_user", validateNewUser, createUser);

router.post("/send_otp", sentOTP);

router.post("/verify_otp", verifyOTP);

module.exports = router;
