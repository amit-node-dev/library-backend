// ROLE MODEL
const { Role } = require("../models");

// CORE-CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");

// CREATE NEW ROLE
const addRole = async (req, res) => {
  try {
    logger.info("roleControllers --> addRole --> reached");
    const { name } = req.body;

    const responseData = await Role.create({ name });

    logger.info("roleControllers --> addRole --> ended");
    return successResponse(res, message.ROLE.CREATE_SUCCESS, responseData, 201);
  } catch (error) {
    logger.error("roleControllers --> addRole --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// GET ALL LIST OF ROLES
const getAllRolesList = async (req, res) => {
  try {
    logger.info("roleControllers --> getAllRolesList --> reached");
    const responseData = await Role.findAll();

    logger.info("roleControllers --> getAllRolesList --> ended");
    return successResponse(
      res,
      message.ROLE.LIST_FETCH_SUCCESS,
      responseData,
      200
    );
  } catch (error) {
    logger.error("roleControllers --> getAllRolesList --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// GET ROLE BY ID
const getRoleById = async (req, res) => {
  logger.info("roleControllers --> getRoleId --> reached");
  const { id } = req.params;
  try {
    const responseData = await Role.findByPk(id);

    if (!responseData) {
      return errorResponse(res, message.ROLE.ROLE_NOT_FOUND, null, 404);
    }

    logger.info("roleControllers --> getRoleId --> ended");
    return successResponse(res, message.ROLE.FETCH_SUCCESS, responseData, 200);
  } catch (error) {
    logger.error("roleControllers --> getRoleId --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

// UPDATE USER BY ID
const updateRole = async (req, res) => {
  logger.info("roleControllers --> updateRole --> reached");
  const { id } = req.params;
  const { name } = req.body;
  try {
    const responseData = await Role.findByPk(id);

    if (!responseData) {
      return errorResponse(res, message.ROLE.ROLE_NOT_FOUND, null, 404);
    }

    responseData.name = name;

    await responseData.save();

    logger.info("roleControllers --> updateRole --> ended");
    return successResponse(res, message.ROLE.UPDATE_SUCCESS, responseData, 200);
  } catch (error) {
    logger.error("roleControllers --> updateRole --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

const deleteRole = async (req, res) => {
  logger.info("roleControllers --> deleteRole --> reached");
  const { id } = req.params;
  try {
    const responseRoleData = await Role.findByPk(id);

    if (!responseRoleData) {
      return errorResponse(res, message.ROLE.ROLE_NOT_FOUND, null, 404);
    }

    await responseRoleData.destroy();

    logger.info("roleControllers --> deleteRole --> ended");
    return successResponse(
      res,
      message.ROLE.DELETE_SUCCESS,
      responseRoleData,
      200
    );
  } catch (error) {
    logger.error("roleControllers --> deleteRole --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

module.exports = {
  addRole,
  getAllRolesList,
  getRoleById,
  updateRole,
  deleteRole,
};
