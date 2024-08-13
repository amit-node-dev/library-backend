"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Author extends Model {
    static associate(models) {
      Author.belongsToMany(models.Book, {
        through: models.BookAuthor,
        foreignKey: "author_id",
        as: "bookauthors",
      });
    }
  }

  Author.init(
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
      biography: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Author",
    }
  );
  return Author;
};
