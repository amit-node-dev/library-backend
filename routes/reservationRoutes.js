const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
  createReservation,
  getReservedBookStatus,
  getAllReservations,
  getReservationById,
  updateReservation,
} = require("../controllers/reservationControllers");

router.post("/add_reservations", createReservation);
router.post("/get_reservation_status", getReservedBookStatus);
router.get("/", getAllReservations);
router.get("/:id", getReservationById);
router.put("/:id", updateReservation);

module.exports = router;
