const Sequelize = require("sequelize");
const sequelize = require("../core-configurations/sequelize-config/sequelize");

const User = require("./user")(sequelize);
const Role = require("./role")(sequelize);
const Book = require("./books")(sequelize);
const Author = require("./authors")(sequelize);
const Category = require("./category")(sequelize);

const db = {
  User,
  Role,
  Book,
  Author,
  Category,
  sequelize,
  Sequelize,
};

User.associate({ Role });
Role.associate({ User });

Book.associate({ Author, Category });
Author.associate({ Book });
Category.associate({ Book });

module.exports = db;
