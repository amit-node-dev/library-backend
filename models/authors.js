"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Authors extends Model {
    static associate(models) {
      Authors.hasMany(models.Books, {
        foreignKey: "authorId",
        as: "books",
      });
    }
  }

  Authors.init(
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
      modelName: "Authors",
    }
  );
  return Authors;
};
