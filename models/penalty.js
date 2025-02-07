"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Penalty extends Model {
    static associate(models) {
      // Penalty belongs to a User
      Penalty.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      // Penalty belongs to a Book
      Penalty.belongsTo(models.Book, {
        foreignKey: "book_id",
        as: "book",
      });
    }
  }
  Penalty.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Books",
          key: "id",
        },
      },
      fine: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Penalty",
    }
  );
  return Penalty;
};
