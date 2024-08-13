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
const Notification = require("./notification")(sequelize);
const Feedback = require("./feedback")(sequelize);
const Fine = require("./fine")(sequelize);
const AuditLog = require("./auditlog")(sequelize);
const BookAuthor = require("./bookauthor")(sequelize);

const db = {
  User,
  Role,
  Book,
  Author,
  Category,
  Reservation,
  BorrowingRecord,
  Notification,
  Feedback,
  Fine,
  AuditLog,
  BookAuthor,
  sequelize,
  Sequelize,
};

// Define model associations
User.associate({
  BorrowingRecord,
  Reservation,
  Notification,
  Role,
  Feedback,
  Fine,
  AuditLog,
});
BorrowingRecord.associate({ User, Book, Fine });
Reservation.associate({ User, Book });
Notification.associate({ User });
Role.associate({ User });
Feedback.associate({ User });
Fine.associate({ User, BorrowingRecord });
AuditLog.associate({ User });
Book.associate({ Author, BookAuthor, Category, BorrowingRecord, Reservation });
Author.associate({ Book, BookAuthor });
BookAuthor.associate({ Book, Author });
Category.associate({ Book });

module.exports = db;
