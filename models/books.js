"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsToMany(models.Author, {
        through: models.BookAuthor,
        foreignKey: "book_id",
        as: "bookauthor",
      });
      Book.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });
    }
  }

  Book.init(
    {
      bookname: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      author: {
        type: DataTypes.INTEGER,
        references: {
          model: "Authors",
          key: "id",
        },
        allowNull: false,
      },
      category: {
        type: DataTypes.INTEGER,
        references: {
          model: "Categories",
          key: "id",
        },
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      conclusion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isbn: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: true,
      },
      publisher: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      publication_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total_copies: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      available_copies: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Book",
      timestamps: true,
    }
  );

  return Book;
};
