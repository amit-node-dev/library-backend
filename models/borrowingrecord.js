"use strict";
const { Model, DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  class BorrowingRecord extends Model {
    static associate(models) {
      BorrowingRecord.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      BorrowingRecord.belongsTo(models.Book, {
        foreignKey: "bookId",
        as: "book",
      });
    }
  }

  BorrowingRecord.init(
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
      borrowDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      returnDate: {
        type: DataTypes.DATE,
        validate: {
          isDate: true,
        },
      },
      status: {
        type: DataTypes.ENUM("none", "borrowed", "returned", "overdue"),
        defaultValue: "none",
        validate: {
          isIn: {
            args: [["none", "borrowed", "returned", "overdue"]],
            msg: "Status must be one of 'borrowed', 'returned', or 'overdue'",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "BorrowingRecord",
    }
  );

  return BorrowingRecord;
};
