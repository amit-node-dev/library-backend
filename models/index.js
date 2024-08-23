const Sequelize = require("sequelize");
const sequelize = require("../core-configurations/sequelize-config/sequelize");

// Import models
const User = require("./user")(sequelize);
const Role = require("./role")(sequelize);
const Book = require("./books")(sequelize);
const Author = require("./authors")(sequelize);
const Category = require("./category")(sequelize);
const Reservation = require("./reservation")(sequelize);
const BorrowingRecord = require("./borrowingrecord")(sequelize);
const BookAuthor = require("./bookauthor")(sequelize);

const db = {
  User,
  Role,
  Book,
  Author,
  Category,
  Reservation,
  BorrowingRecord,
  BookAuthor,
  sequelize,
  Sequelize,
};

// Define model associations
User.associate({
  BorrowingRecord,
  Reservation,
  Role,
});
BorrowingRecord.associate({ User, Book });
Reservation.associate({ User, Book });
Role.associate({ User });
Book.associate({ Author, BookAuthor, Category, BorrowingRecord, Reservation });
Author.associate({ Book, BookAuthor });
BookAuthor.associate({ Book, Author });
Category.associate({ Book });

module.exports = db;
