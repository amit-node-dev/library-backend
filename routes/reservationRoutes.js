const express = require("express");
const router = express.Router();

// MIDDLEWARE
const checkRole = require("../middlewares/checkRole");
const { validateReservation } = require("../middlewares/validations");

// CONTROLLERS
const {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservationControllers");

// PERMISSIONS
const permission = ["super_admin", "admin", "customer"];

router.post(
  "/",
  checkRole(["super_admin"]),
  validateReservation,
  createReservation
);
router.get("/", checkRole(permission), getAllReservations);
router.get("/:id", checkRole(permission), getReservationById);
router.put("/:id", checkRole(["super_admin"]), updateReservation);
router.delete("/:id", checkRole(["super_admin"]), deleteReservation);

module.exports = router;
