"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          name: "Fantasy",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Fiction",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Thriller",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Horror",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Mystery",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Biography",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
