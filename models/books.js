"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Book extends Model {
    static associate(models) {
      // Book belongs to many Authors through BookAuthor
      Book.belongsTo(models.Author, {
        foreignKey: "author_id",
        as: "author",
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

      Book.hasMany(models.Penalty, {
        foreignKey: "book_id",
        as: "penalties",
      });
    }
  }

  Book.init(
    {
      bookName: {
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
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      publicationYear: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      totalCopies: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      availableCopies: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      authorId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Authors",
          key: "id",
        },
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Categories",
          key: "id",
        },
        allowNull: false,
      },
      pointsRequired: {
        type: DataTypes.INTEGER,
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
