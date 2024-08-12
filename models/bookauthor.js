"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Book = require("./Book");
const Author = require("./Author");

class BookAuthor extends Model {}

BookAuthor.init(
  {
    book_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Book,
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Author,
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BookAuthor",
    tableName: "BookAuthors",
    timestamps: false,
  }
);

Book.belongsToMany(Author, { through: BookAuthor, foreignKey: "book_id" });
Author.belongsToMany(Book, { through: BookAuthor, foreignKey: "author_id" });

module.exports = BookAuthor;
