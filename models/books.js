"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Book extends Model {
    static associate(models) {
      // Book belongs to many Authors through BookAuthor
      Book.belongsToMany(models.Author, {
        through: models.BookAuthor,
        foreignKey: "book_id",
        as: "authors",
      });

      // Book belongs to a Category
      Book.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });

      // Book has many BorrowingRecords
      Book.hasMany(models.BorrowingRecord, {
        foreignKey: "book_id",
        as: "borrowingRecords",
      });

      // Book has many Reservations
      Book.hasMany(models.Reservation, {
        foreignKey: "book_id",
        as: "reservations",
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
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Categories",
          key: "id",
        },
        allowNull: false,
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
