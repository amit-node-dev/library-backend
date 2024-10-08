"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "users",
      });
      Reservation.belongsTo(models.Book, {
        foreignKey: "book_id",
        as: "books",
      });
    }
  }

  Reservation.init(
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
      book_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Books",
          key: "id",
        },
        allowNull: false,
      },
      reservation_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          notNull: {
            msg: "Reservation date is required",
          },
        },
      },
      status: {
        type: DataTypes.ENUM("none", "reserved", "unreserved"),
        defaultValue: "none",
        validate: {
          isIn: {
            args: [["none", "reserved", "unreserved"]],
            msg: "Status must be one of 'reserved', 'unreserved'",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Reservation",
    }
  );

  return Reservation;
};
