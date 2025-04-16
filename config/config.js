const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Common configuration for all environments
const commonConfig = {
  dialect: process.env.MYSQL_DIALECT || "mysql",
  logging: process.env.MYSQL_LOGGING === "true" ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
};

// Database configurations for different environments
const dbConfig = {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    ...commonConfig,
  },
  test: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    ...commonConfig,
  },
  production: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    pool: {
      max: 15,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
    ...commonConfig,
  },
};

module.exports = dbConfig;
