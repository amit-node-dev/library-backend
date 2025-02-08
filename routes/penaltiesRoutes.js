const express = require("express");
const router = express.Router();

// CONTROLLERS
const { getAllPenaltyList } = require("../controllers/penaltiesControllers");

router.get("/", getAllPenaltyList);

module.exports = router;
