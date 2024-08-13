// MODELS
const { Fine } = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

// Create a new fine
const createFine = async (req, res) => {
  try {
    logger.info("fineControllers --> createFine --> reached");

    const { user_id, record_id, fine_amount, fine_date } = req.body;

    if (!user_id || !record_id || !fine_amount || !fine_date) {
      return errorResponse(res, message.AUTH.INVALID_INPUT, null, 400);
    }

    const fine = await Fine.create({
      user_id,
      record_id,
      fine_amount,
      fine_date,
    });

    logger.info("fineControllers --> createFine --> ended");
    return successResponse(res, message.COMMON.ADDED_SUCCESS, fine, 201);
  } catch (error) {
    logger.error("fineControllers --> createFine --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Get all fines
const getAllFines = async (req, res) => {
  try {
    logger.info("fineControllers --> getAllFines --> reached");

    const fines = await Fine.findAll({
      include: ["user", "borrowingRecord"],
    });

    logger.info("fineControllers --> getAllFines --> ended");
    return successResponse(res, message.COMMON.LIST_FETCH_SUCCESS, fines, 200);
  } catch (error) {
    logger.error("fineControllers --> getAllFines --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Get fine by ID
const getFineById = async (req, res) => {
  try {
    logger.info("fineControllers --> getFineById --> reached");

    const { id } = req.params;

    const fine = await Fine.findByPk(id, {
      include: ["user", "borrowingRecord"],
    });

    if (!fine) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    logger.info("fineControllers --> getFineById --> ended");
    return successResponse(res, message.COMMON.FETCH_SUCCESS, fine, 200);
  } catch (error) {
    logger.error("fineControllers --> getFineById --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Update fine
const updateFine = async (req, res) => {
  try {
    logger.info("fineControllers --> updateFine --> reached");

    const { id } = req.params;
    const { fine_amount, paid, fine_date } = req.body;

    const fine = await Fine.findByPk(id);
    if (!fine) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    fine.fine_amount = fine_amount || fine.fine_amount;
    fine.paid = paid !== undefined ? paid : fine.paid;
    fine.fine_date = fine_date || fine.fine_date;

    await fine.save();

    logger.info("fineControllers --> updateFine --> ended");
    return successResponse(res, message.COMMON.UPDATE_SUCCESS, fine, 200);
  } catch (error) {
    logger.error("fineControllers --> updateFine --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// Delete fine
const deleteFine = async (req, res) => {
  try {
    logger.info("fineControllers --> deleteFine --> reached");

    const { id } = req.params;

    const fine = await Fine.findByPk(id);
    if (!fine) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    await fine.destroy();

    logger.info("fineControllers --> deleteFine --> ended");
    return successResponse(res, message.COMMON.DELETE_SUCCESS, fine, 200);
  } catch (error) {
    logger.error("fineControllers --> deleteFine --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

module.exports = {
  createFine,
  getAllFines,
  getFineById,
  updateFine,
  deleteFine,
};
