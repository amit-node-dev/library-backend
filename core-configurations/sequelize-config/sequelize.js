const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");

// Load the appropriate .env file
dotenv.config();

const infoLogger = {
  info: (msg) => console.log(msg),
};

const sequelize = new Sequelize({
  database: process.env.MYSQL_DATABASE,
  dialect: process.env.MYSQL_DIALECT,
  logging: (msg) => infoLogger.info("Query ::: " + msg),
  logQueryParameters: true,
  replication: {
    read: [
      {
        host: process.env.MYSQL_HOST,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        port: process.env.MYSQL_PORT,
      },
    ],
    write: {
      host: process.env.MYSQL_HOST,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      port: process.env.MYSQL_PORT,
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
