"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Role extends Model {
    static associate(models) {}
  }
  Role.init(
    {
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
