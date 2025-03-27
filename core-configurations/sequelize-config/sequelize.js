"use strict";

const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");
const logger = require("../logger-config/logger");

// Load environment variables
dotenv.config();

// Database configuration
const sequelize = new Sequelize({
  database: process.env.MYSQL_DATABASE,
  dialect: process.env.MYSQL_DIALECT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_DBPORT,
  logging: (msg) => logger.info(`[SQL] ${msg}`),
  define: {
    timestamps: true,
    freezeTableName: true 
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  ...(process.env.MYSQL_HOST && {
    replication: {
      read: [{
        host: process.env.MYSQL_HOST,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        port: process.env.MYSQL_DBPORT
      }],
      write: {
        host: process.env.MYSQL_HOST,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        port: process.env.MYSQL_DBPORT
      }
    }
  })
});

module.exports = sequelize;