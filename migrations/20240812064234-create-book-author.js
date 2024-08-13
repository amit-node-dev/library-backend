"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BookAuthors", {
      book_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Books",
          key: "id",
        },
        allowNull: false,
      },
      author_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Authors",
          key: "id",
        },
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BookAuthors");
  },
};
