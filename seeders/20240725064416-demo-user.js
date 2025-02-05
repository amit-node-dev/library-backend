"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch the role IDs to associate with users
    const roles = await queryInterface.sequelize.query(
      `SELECT id,name from Roles;`
    );
    const role = roles.find((role) => role.name === "super_admin");

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstname: "Amit",
          lastname: "Vishwakarma",
          email: "amit.vishwakarma@gmail.com",
          password: "Amit@4582",
          role_id: role ? role.id : 1,
          mobileNumber: "7001081661",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
