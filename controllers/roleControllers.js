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

    const role = await Role.create({ name });

    logger.info("roleControllers --> addRole --> ended");
    return successResponse(res, message.COMMON.ADDED_SUCCESS, role, 201);
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
  const { page, pageSize } = req.query;

  try {
    logger.info("roleControllers --> getAllRolesList --> reached");

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize, 10);

    const { count, rows } = await Role.findAndCountAll({
      offset,
      limit,
    });

    const rolesData = {
      roles: rows,
      total: count,
      page: parseInt(page, 10),
      pageSize: limit,
    };

    logger.info("roleControllers --> getAllRolesList --> ended");
    return successResponse(
      res,
      message.COMMON.LIST_FETCH_SUCCESS,
      rolesData,
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
    const role = await Role.findByPk(id);

    if (!role) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    logger.info("roleControllers --> getRoleId --> ended");
    return successResponse(res, message.COMMON.FETCH_SUCCESS, role, 200);
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
    const role = await Role.findByPk(id);

    if (!role) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    role.name = name;

    await role.save();

    logger.info("roleControllers --> updateRole --> ended");
    return successResponse(res, message.COMMON.UPDATE_SUCCESS, role, 200);
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
    const role = await Role.findByPk(id);

    if (!role) {
      return errorResponse(res, message.COMMON.NOT_FOUND, null, 404);
    }

    await role.destroy();

    logger.info("roleControllers --> deleteRole --> ended");
    return successResponse(res, message.COMMON.DELETE_SUCCESS, role, 200);
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
