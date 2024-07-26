"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Authors",
      [
        {
          firstname: "Tommy",
          lastname: "Helson",
          email: "tommy.helson@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Rajveer",
          lastname: "Sinha",
          email: "rajveer@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Authors", null, {});
  },
};
