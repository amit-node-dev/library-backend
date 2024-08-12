const Sequelize = require("sequelize");
const sequelize = require("../core-configurations/sequelize-config/sequelize");

const User = require("./user")(sequelize);
const Role = require("./role")(sequelize);
const Book = require("./books")(sequelize);
const Author = require("./authors")(sequelize);
const Category = require("./category")(sequelize);
const Reservation = require("./reservation")(sequelize);
const BorrowingRecord = require("./borrowingrecord")(sequelize);
const Notification = require("./notification")(sequelize);
const Feedback = require("./feedback")(sequelize);
const AuditLog = require("./auditlog")(sequelize);

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
  AuditLog,
  sequelize,
  Sequelize,
};

// Define model associations
User.associate(db);
Role.associate(db);
Book.associate(db);
Author.associate(db);
Category.associate(db);
Reservation.associate(db);
BorrowingRecord.associate(db);
Notification.associate(db);
Feedback.associate(db);
AuditLog.associate(db);

// User.associate({ Role });
// Role.associate({ User });

// Book.associate({ Author, Category });
// Author.associate({ Book });
// Category.associate({ Book });

module.exports = db;
