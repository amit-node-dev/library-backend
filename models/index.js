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
const Penalty = require("./penalty")(sequelize);

const db = {
  User,
  Role,
  Book,
  Author,
  Category,
  Reservation,
  BorrowingRecord,
  Penalty,
  sequelize,
  Sequelize,
};

// Define model associations
User.associate({
  BorrowingRecord,
  Reservation,
  Role,
  Penalty,
});
BorrowingRecord.associate({ User, Book });
Reservation.associate({ User, Book });
Role.associate({ User });
Book.associate({
  Author,
  Category,
  BorrowingRecord,
  Reservation,
  Penalty,
});
Author.associate({ Book });
Category.associate({ Book });
Penalty.associate({ User, Book });

module.exports = db;
