const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
  addBorrowingRecord,
  getBorrowBookRecordStatus,
  getAllBorrowingRecords,
  getBorrowingRecordById,
  updateBorrowingRecord,
  deleteBorrowingRecord,
} = require("../controllers/borrowingRecordControllers");

router.post("/add_borrow_records", addBorrowingRecord);
router.post("/get_borrow_status", getBorrowBookRecordStatus);
router.get("/", getAllBorrowingRecords);
router.get("/:id", getBorrowingRecordById);
router.put("/:id", updateBorrowingRecord);
router.delete("/:id", deleteBorrowingRecord);

module.exports = router;
