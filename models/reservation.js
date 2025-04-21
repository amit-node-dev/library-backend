"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Reservation.belongsTo(models.Book, {
        foreignKey: "bookId",
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
