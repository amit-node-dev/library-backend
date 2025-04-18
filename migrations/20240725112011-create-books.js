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
      bookName: {
        type: Sequelize.STRING(100),
      },
      title: {
        type: Sequelize.TEXT,
      },
      authorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Authors",
          key: "id",
        },
        allowNull: false,
      },
      categoryId: {
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
        type: Sequelize.STRING(50),
      },
      publicationYear: {
        type: Sequelize.STRING(50),
      },
      totalCopies: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      availableCopies: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      location: {
        type: Sequelize.STRING(50),
      },
      pointsRequired: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
