"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Role extends Model {
    static associate(models) {
      // Role has many Users
      Role.hasMany(models.User, {
        foreignKey: "roleId",
        as: "users",
      });
    }
  }
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Roles",
    }
  );
  return Role;
};
