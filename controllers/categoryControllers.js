// ROLE MODEL
const { Category } = require("../models");

// CORE-CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages"); // ROLE MODEL

// GET ALL LIST OF CATEGORIES
const getAllCategoriesList = async (req, res) => {
  try {
    logger.info("categoryControllers --> getAllCategoriesList --> reached");

    const categories = await Category.findAll({});

    logger.info("categoryControllers --> getAllCategoriesList --> ended");
    return successResponse(
      res,
      message.COMMON.LIST_FETCH_SUCCESS,
      categories,
      200
    );
  } catch (error) {
    logger.error(
      "categoryControllers --> getAllCategoriesList --> error",
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

module.exports = { getAllCategoriesList };
