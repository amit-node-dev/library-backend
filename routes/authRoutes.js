const express = require("express");

// CONTROLLERS
const { loginUser } = require("../controllers/authControllers");

// MIDDLEWARE MODULE
const { validateAuth } = require("../middlewares/validations");

const router = express.Router();

router.post("/login", validateAuth, loginUser);

module.exports = router;
