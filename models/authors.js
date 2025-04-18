"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Author extends Model {
    static associate(models) {
      // One author has many books
      Author.hasMany(models.Book, {
        foreignKey: "author_id",
        as: "books",
      });
    }
  }

  Author.init(
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
