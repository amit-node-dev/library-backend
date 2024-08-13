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
      firstname: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      lastname: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [8, 100],
        },
      },
      role: {
        type: Sequelize.INTEGER,
        references: {
          model: "Roles",
          key: "id",
        },
        allowNull: false,
        defaultValue: 3,
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
      mobileNumber: {
        type: Sequelize.STRING(15),
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
    await queryInterface.dropTable("Users");
  },
};
