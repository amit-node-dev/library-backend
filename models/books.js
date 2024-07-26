"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Books extends Model {
    static associate(models) {
      Books.belongsTo(models.Authors, {
        foreignKey: "authorId",
        as: "author",
      });
    }
  }
  Books.init(
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
      modelName: "Books",
    }
  );
  return Books;
};
