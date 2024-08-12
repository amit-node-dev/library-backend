"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Fine extends Model {
    static associate(models) {}
  }

  Fine.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      record_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "BorrowingRecords",
          key: "id",
        },
        allowNull: false,
      },
      fine_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 0,
          notNull: {
            msg: "Fine amount is required",
          },
        },
      },
      paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      fine_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          notNull: {
            msg: "Fine date is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Fine",
    }
  );

  return Fine;
};
