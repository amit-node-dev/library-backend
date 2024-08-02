"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.Author, {
        foreignKey: "authorId",
        as: "author",
      });
    }
  }
  Book.init(
    {
      bookname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Authors",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
