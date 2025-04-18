"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      Reservation.belongsTo(models.Book, {
        foreignKey: "book_id",
        as: "book",
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
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      bookId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Books",
          key: "id",
        },
        allowNull: false,
      },
      reservationDate: {
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
