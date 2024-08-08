const express = require("express");

// CHECK ROLE ACCORDING TO ROUTES
const checkRole = require("../middlewares/checkRole");

//  TO VALIDATE USER DATA TYPES WHILE CREATING NEW USER
const { validateRole } = require("../middlewares/validations");

// CONTROLLERS
const {
  addRole,
  getAllRolesList,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/roleControllers");

const router = express.Router();

const permission = ["super_admin", "admin", "customer"];

// Private routes (require authentication)
router.post("/add_roles", validateRole, checkRole(["super_admin"]), addRole);

router.get("/", checkRole(permission), getAllRolesList);

router.get("/:id", checkRole(permission), getRoleById);

router.put("/:id", validateRole, checkRole(["super_admin"]), updateRole);

router.delete("/:id", checkRole(["super_admin"]), deleteRole);

module.exports = router;
