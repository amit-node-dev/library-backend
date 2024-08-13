"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch the role IDs to associate with users
    const roles = await queryInterface.sequelize.query(
      `SELECT id,name from Roles;`
    );
    const role = roles.find((role) => role.name === "customer");

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstname: "Amit",
          lastname: "Vishwakarma",
          email: "amit.vishwakarma@gmail.com",
          password:
            "$2y$10$CTRkjgznicnOPtqGg9xpZOyYpScCaqNRAjlcNcOCBQ2VIQInoprzG",
          role_id: role ? role.id : 3,
          mobileNumber: "+917001081661",
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
