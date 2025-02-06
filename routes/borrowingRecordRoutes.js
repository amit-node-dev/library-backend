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

router.post("/add-borrow-record", addBorrowingRecord);
router.post("/get-borrow-status", getBorrowBookRecordStatus);
router.get("/:id", getBorrowingRecordById);
router.post("/return-borrow-record", returnBorrowingRecord);
router.get("/", getAllBorrowingRecords);
router.put("/:id", updateBorrowingRecord);
router.delete("/:id", deleteBorrowingRecord);

module.exports = router;
