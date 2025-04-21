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
        allowNull: false
      },
      title: {
        type: Sequelize.TEXT('medium'),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT('long'),
        allowNull: false
      },
      conclusion: {
        type: Sequelize.TEXT("medium"),
        allowNull: false
      },
      isbn: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: false
      },
      publisher: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      publicationYear: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      totalCopies: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      availableCopies: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      location: {
        type: Sequelize.STRING(50),
        allowNull: true,
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
