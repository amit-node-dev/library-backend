// MODELS
const { User, Role } = require("../models");

// UITLS MODULES
const message = require("../utils/commonMessages");
const { errorResponse } = require("../utils/handleResponse");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// THIS FUNCTIONALITY WILL CHECK ROLE AND PROVIDE ACCESS TO THE ROUTES.
const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId, {
        include: {
          model: Role,
          as: "role",
        },
      });

      if (!user || !roles.includes(user.role.name)) {
        return errorResponse(res, message.AUTH.ACCESS_DENIED, null, 403);
      }

      next();
    } catch (error) {
      logger.error("Error in check role middleware ::: ", error);
      return errorResponse(
        res,
        message.SERVER.INTERNAL_SERVER_ERROR,
        error,
        500
      );
    }
  };
};

module.exports = checkRole;
