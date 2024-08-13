"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class BookAuthor extends Model {
    static associate(models) {
      // BookAuthor belongs to Book
      BookAuthor.belongsTo(models.Book, {
        foreignKey: "book_id",
        as: "books",
      });

      // BookAuthor belongs to Author
      BookAuthor.belongsTo(models.Author, {
        foreignKey: "author_id",
        as: "authors",
      });
    }
  }

  BookAuthor.init(
    {
      book_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Book",
          key: "id",
        },
        allowNull: false,
      },
      author_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Author",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BookAuthor",
      timestamps: false,
    }
  );

  return BookAuthor;
};
