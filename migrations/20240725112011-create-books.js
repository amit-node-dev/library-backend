"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Books", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bookname: {
        type: Sequelize.STRING(100),
      },
      title: {
        type: Sequelize.TEXT,
      },
      author: {
        type: Sequelize.INTEGER,
        references: {
          model: "Authors",
          key: "id",
        },
        allowNull: false,
      },
      category: {
        type: Sequelize.INTEGER,
        references: {
          model: "Categories",
          key: "id",
        },
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      conclusion: {
        type: Sequelize.TEXT,
      },
      isbn: {
        type: Sequelize.STRING(20),
        unique: true,
      },
      publisher: {
        type: Sequelize.STRING(255),
      },
      publication_year: {
        type: Sequelize.INTEGER,
      },
      total_copies: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      available_copies: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      location: {
        type: Sequelize.STRING(200),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Books");
  },
};
