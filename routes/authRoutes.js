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

router.post("/register-user", validateNewUser, createUser);

router.post("/login", validateAuth, loginUser);

router.post("/logout", logoutUser);

router.post("/send-otp", sentOTP);

router.post("/verify-otp", verifyOTP);

module.exports = router;
