const Sequelize = require("sequelize");
const sequelize = require("../core-configurations/sequelize-config/sequelize");

const User = require("./user")(sequelize);
const Book = require("./books")(sequelize);
const Author = require("./authors")(sequelize);

const db = {
  User,
  Book,
  Author,
  sequelize,
  Sequelize,
};

if (User.associate) {
  User.associate(db);
}

module.exports = db;
