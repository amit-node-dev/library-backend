const express = require("express");

// CONTROLLERS
const { getAllCategoriesList } = require("../controllers/categoryControllers");

const router = express.Router();

// Private routes (require authentication)
router.get("/", getAllCategoriesList);

module.exports = router;
