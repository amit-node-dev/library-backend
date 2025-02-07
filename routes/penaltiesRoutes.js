const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
  getAllPenaltyList,
  addPenalty,
} = require("../controllers/penaltiesControllers");

router.get("/", getAllPenaltyList);
router.post("/add-penalty", addPenalty);

module.exports = router;
