"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class AuditLog extends Model {
  static associate(models) {
    AuditLog.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }
}

AuditLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Action field cannot be empty",
        },
      },
    },
    action_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    details: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "AuditLog",
  }
);

module.exports = AuditLog;
