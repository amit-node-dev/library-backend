"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categoryOptions = [
      { id: 1, value: "Fantasy" },
      { id: 2, value: "Fiction" },
      { id: 3, value: "Thriller" },
      { id: 4, value: "Horror" },
      { id: 5, value: "Mystery" },
      { id: 6, value: "Biography" },
    ];

    const categories = categoryOptions.map((category) => ({
      id: category.id,
      name: category.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Categorys", categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categorys", null, {});
  },
};
