"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Role extends Model {
    static associate(models) {}
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
      modelName: "Role",
    }
  );
  return Role;
};
