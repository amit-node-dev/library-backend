"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Author extends Model {
    static associate(models) {
      Author.hasMany(models.Book, {
        foreignKey: "authorId",
        as: "books",
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
    },
    {
      sequelize,
      modelName: "Author",
    }
  );
  return Author;
};
