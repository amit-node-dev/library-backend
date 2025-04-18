const express = require("express");

// CONTROLLERS
const {
  loginUser,
  logoutUser,
  sentOTP,
  verifyOTP,
} = require("../controllers/authControllers");
const { registerUser } = require("../controllers/userControllers");

// MIDDLEWARE MODULE
const { newUserValidation, authValidation } = require("../middlewares/validations");

const router = express.Router();

router.post("/register-user", newUserValidation, registerUser);

router.post("/login", authValidation, loginUser);

router.post("/logout", logoutUser);

router.post("/send-otp", sentOTP);

router.post("/verify-otp", verifyOTP);

module.exports = router;
