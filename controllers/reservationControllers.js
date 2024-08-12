// MODELS
const { Reservation, Book } = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

// Create a new reservation
const createReservation = async (req, res) => {
  try {
    logger.info("reservationControllers --> createReservation --> reached");

    const { userId, bookId } = req.body;

    const book = await Book.findByPk(bookId);

    if (!book) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 400);
    }

    const newReservation = await Reservation.create({ userId, bookId });

    logger.info("reservationControllers --> createReservation --> ended");
    return successResponse(
      res,
      message.COMMON.ADDED_SUCCESS,
      newReservation,
      201
    );
  } catch (error) {
    logger.error(
      "reservationControllers --> createReservation --> error",
      error
    );
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Get all reservations
const getAllReservations = async (req, res) => {
  try {
    logger.info("reservationControllers --> getAllReservations --> reached");

    const reservations = await Reservation.findAll({
      include: ["user", "book"],
    });

    logger.info("reservationControllers --> getAllReservations --> ended");
    return successResponse(
      res,
      message.COMMON.LIST_FETCH_SUCCESS,
      reservations,
      200
    );
  } catch (error) {
    logger.error(
      "reservationControllers --> getAllReservations --> error",
      error
    );
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Get reservation by ID
const getReservationById = async (req, res) => {
  try {
    logger.info("reservationControllers --> getReservationById --> reached");

    const { id } = req.params;
    const reservation = await Reservation.findByPk(id, {
      include: ["user", "book"],
    });

    if (!reservation) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    logger.info("reservationControllers --> getReservationById --> ended");
    return successResponse(res, message.COMMON.FETCH_SUCCESS, reservation, 200);
  } catch (error) {
    logger.error(
      "reservationControllers --> getReservationById --> error",
      error
    );
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Update reservation
const updateReservation = async (req, res) => {
  try {
    logger.info("reservationControllers --> updateReservation --> reached");

    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    const { status } = req.body;
    reservation.status = status || reservation.status;

    await reservation.save();

    logger.info("reservationControllers --> updateReservation --> ended");
    return successResponse(res, message.COMMON.FETCH_SUCCESS, reservation, 200);
  } catch (error) {
    logger.error(
      "reservationControllers --> updateReservation --> error",
      error
    );
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Delete reservation
const deleteReservation = async (req, res) => {
  try {
    logger.info("reservationControllers --> deleteReservation --> reached");

    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    await reservation.destroy();
    logger.info("reservationControllers --> deleteReservation --> ended");
    return successResponse(res, message.COMMON.FETCH_SUCCESS, reservation, 200);
  } catch (error) {
    logger.error(
      "reservationControllers --> deleteReservation --> error",
      error
    );
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

module.exports = {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
};
