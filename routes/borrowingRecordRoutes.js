const express = require("express");
const router = express.Router();

// MIDDLEWARE
const checkRole = require("../middlewares/checkRole");
const { validateBorrowingRecord } = require("../middlewares/validations");

// CONTROLLERS
const {
  createBorrowingRecord,
  getAllBorrowingRecords,
  getBorrowingRecordById,
  updateBorrowingRecord,
  deleteBorrowingRecord,
} = require("../controllers/borrowingRecordControllers");

// PERMISSION
const permission = ["super_admin", "admin", "customer"];

router.post(
  "/",
  checkRole(["super_admin"]),
  validateBorrowingRecord,
  createBorrowingRecord
);
router.get("/", checkRole(permission), getAllBorrowingRecords);
router.get("/:id", checkRole(permission), getBorrowingRecordById);
router.put(
  "/:id",
  checkRole(["super_admin"]),
  validateBorrowingRecord,
  updateBorrowingRecord
);
router.delete("/:id", checkRole(["super_admin"]), deleteBorrowingRecord);

module.exports = router;
