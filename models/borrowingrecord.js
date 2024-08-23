"use strict";
const { Model, DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  class BorrowingRecord extends Model {
    static associate(models) {
      BorrowingRecord.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "users",
      });
      BorrowingRecord.belongsTo(models.Book, {
        foreignKey: "book_id",
        as: "books",
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
      borrow_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          notNull: {
            msg: "Borrow date is required",
          },
        },
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          notNull: {
            msg: "Due date is required",
          },
        },
      },
      return_date: {
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
