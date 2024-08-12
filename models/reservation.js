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
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("waiting", "notified", "canceled"),
        defaultValue: "waiting",
      },
    },
    {
      sequelize,
      modelName: "Reservation",
      timestamps: false,
    }
  );

  return Reservation;
};
