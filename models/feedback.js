"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Feedback extends Model {
    static associate(models) {
      Feedback.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  Feedback.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      feedback_text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Feedback text cannot be empty",
          },
        },
      },
      feedback_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      response: {
        type: DataTypes.TEXT,
      },
      response_date: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Feedback",
    }
  );

  return Feedback;
};
