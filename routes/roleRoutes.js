const express = require("express");

// CHECK ROLE ACCORDING TO ROUTES
const checkRole = require("../middlewares/checkRole");

//  TO VALIDATE USER DATA TYPES WHILE CREATING NEW USER
const { validateRole } = require("../middlewares/validations");

// CONTROLLERS
const {
  getAllRolesList,
  addRole,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/roleControllers");

const router = express.Router();

// Private routes (require authentication)
router.post("/add_roles", validateRole, checkRole(["super_admin"]), addRole);

router.get(
  "/",
  checkRole(["super_admin", "admin", "super_agent", "agent"]),
  getAllRolesList
);

router.get(
  "/:id",
  checkRole(["super_admin", "admin", "super_agent", "agent"]),
  getRoleById
);

router.put("/:id", validateRole, checkRole(["super_admin"]), updateRole);

router.delete("/:id", checkRole(["super_admin"]), deleteRole);

module.exports = router;
