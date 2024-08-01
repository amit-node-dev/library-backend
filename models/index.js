const Sequelize = require("sequelize");
const sequelize = require("../core-configurations/sequelize-config/sequelize");

const User = require("./user")(sequelize);
const Role = require("./role")(sequelize);
const Book = require("./books")(sequelize);
const Author = require("./authors")(sequelize);

const db = {
  User,
  Role,
  Book,
  Author,
  sequelize,
  Sequelize,
};

User.associate({ Role });
Role.associate({ User });

module.exports = db;
