const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
  addBorrowingRecord,
  getBorrowBookRecordStatus,
  getBorrowingRecordById,
  returnBorrowingRecord,
  getAllBorrowingRecords,
  updateBorrowingRecord,
  deleteBorrowingRecord,
} = require("../controllers/borrowingRecordControllers");

router.post("/add_borrow_records", addBorrowingRecord);
router.post("/get_borrow_status", getBorrowBookRecordStatus);
router.get("/:id", getBorrowingRecordById);
router.post("/return_borrow_records", returnBorrowingRecord);
router.get("/", getAllBorrowingRecords);
router.put("/:id", updateBorrowingRecord);
router.delete("/:id", deleteBorrowingRecord);

module.exports = router;
