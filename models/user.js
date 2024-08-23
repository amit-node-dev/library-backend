"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Associations
      User.hasMany(models.BorrowingRecord, {
        foreignKey: "user_id",
        as: "borrowingRecords",
      });
      User.hasMany(models.Reservation, {
        foreignKey: "user_id",
        as: "reservations",
      });
      User.hasMany(models.Notification, {
        foreignKey: "user_id",
        as: "notifications",
      });
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });
      User.hasMany(models.Feedback, { foreignKey: "user_id", as: "feedbacks" });
      User.hasMany(models.AuditLog, { foreignKey: "user_id", as: "auditLogs" });
    }
  }

  User.init(
    {
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [8, 100],
            msg: "Password must be at least 8 characters long",
          },
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Roles",
          key: "id",
        },
        allowNull: false,
        defaultValue: 3,
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
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
