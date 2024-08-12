"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class BorrowingRecord extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      this.belongsTo(models.Book, {
        foreignKey: "book_id",
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
          isAfter: {
            args: Sequelize.col("borrow_date"),
            msg: "Return date must be after the borrow date",
          },
        },
      },
      fine_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        validate: {
          isDecimal: true,
          min: 0,
        },
      },
      status: {
        type: DataTypes.ENUM("borrowed", "returned", "overdue"),
        defaultValue: "borrowed",
        validate: {
          isIn: {
            args: [["borrowed", "returned", "overdue"]],
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
