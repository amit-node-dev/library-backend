"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      emailId: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      mobileNumber: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(25),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(25),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(25),
        allowNull: true,
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Roles",
          key: "id",
        },
        allowNull: true,
        defaultValue: 4,
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
    await queryInterface.dropTable("Users");
  },
};
