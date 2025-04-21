// MODELS
const { User, Role } = require("../models");

// UITLS MODULES
const message = require("../utils/commonMessages");
const { errorResponse } = require("../utils/handleResponse");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// THIS FUNCTIONALITY WILL CHECK ROLE AND PROVIDE ACCESS TO THE ROUTES.
const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const id = req.user.id
      console.log("AAA ", id)

      const user = await User.findByPk(id, {
        include: {
          model: Role,
          as: "role",
          attributes: ["name"],
        },
      });

      if (!user) {
        return errorResponse(res, message.AUTH.USER_NOT_FOUND, null, 403);
      }

      // Check if user has any of the allowed roles
      const userRoleName = user.role?.name;

      if (!userRoleName || !allowedRoles.includes(userRoleName)) {
        return errorResponse(res, message.AUTH.ACCESS_DENIED, null, 403);
      }

      next();
    } catch (error) {
      logger.error("Error in check role middleware ::: ", error);
      return errorResponse(
        res,
        message.SERVER.INTERNAL_ERROR,
        error,
        500
      );
    }
  };
};

module.exports = checkRole;
