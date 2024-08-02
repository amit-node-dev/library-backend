"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      });
    }
  }

  User.init(
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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password is required",
          },
          len: {
            args: [8, 100],
            msg: "Password must be at least 8 characters long",
          },
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Roles",
          key: "id",
        },
        allowNull: false,
        defaultValue: 3,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
