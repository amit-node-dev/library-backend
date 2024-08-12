const express = require("express");
const router = express.Router();

// MIDDLEWARE
const checkRole = require("../middlewares/checkRole");
const { validateFine } = require("../middlewares/validations");

// CONTROLLERS
const {
  createFine,
  getAllFines,
  getFineById,
  updateFine,
  deleteFine,
} = require("../controllers/fineControllers");

// PERMISSIONS
const permission = ["super_admin", "admin", "customer"];

router.post("/", checkRole(["super_admin"]), validateFine, createFine);
router.get("/", checkRole(permission), getAllFines);
router.get("/:id", checkRole(permission), getFineById);
router.put("/:id", checkRole(["super_admin"]), validateFine, updateFine);
router.delete("/:id", checkRole(["super_admin"]), deleteFine);

module.exports = router;
