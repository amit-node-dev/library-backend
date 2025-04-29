"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Associations
      User.hasMany(models.BorrowingRecord, {
        foreignKey: "userId",
        as: "borrowingRecords",
      });

      User.hasMany(models.Reservation, {
        foreignKey: "userId",
        as: "reservations",
      });

      User.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      });

      User.hasMany(models.Penalty, {
        foreignKey: "userId",
        as: "penalties",
      });
    }
  }

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emailId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Roles",
          key: "id",
        },
        allowNull: true,
        defaultValue: 4,
      },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return User;
};
