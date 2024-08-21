const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservationControllers");

router.post("/add_reservations", createReservation);
router.get("/", getAllReservations);
router.get("/:id", getReservationById);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);

module.exports = router;
