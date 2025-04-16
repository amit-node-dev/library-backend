const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Logger Configuration
const logger = require("../logger-config/logger");

// Validate required environment variables
const requiredEnvVars = [
  "MYSQL_DIALECT",
  "MYSQL_DATABASE",
  "MYSQL_HOST",
  "MYSQL_USERNAME",
  "MYSQL_PASSWORD",
  "MYSQL_PORT",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Database Configuration Object
const dbConfig = {
  database: process.env.MYSQL_DATABASE,
  dialect: process.env.MYSQL_DIALECT || "mysql",
  logging: (msg) => logger.debug(`Database Query: ${msg}`),
  logQueryParameters: true,
  replication: {
    read: [
      {
        host: process.env.MYSQL_HOST,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        port: process.env.MYSQL_PORT || 3306,
      },
    ],
    write: {
      host: process.env.MYSQL_HOST,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      port: process.env.MYSQL_PORT || 3306,
    },
  },
  pool: {
    max: parseInt(process.env.MYSQL_POOL_MAX) || 10,
    min: parseInt(process.env.MYSQL_POOL_MIN) || 2,
    acquire: parseInt(process.env.MYSQL_POOL_ACQUIRE) || 30000,
    idle: parseInt(process.env.MYSQL_POOL_IDLE) || 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
    paranoid: process.env.MYSQL_PARANOID === "true",
    freezeTableName: true,
  },
  dialectOptions:
    process.env.MYSQL_SSL === "true"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  benchmark: true,
  timezone: process.env.MYSQL_TIMEZONE || "+00:00",
};

// Initialize Sequelize Instance
const sequelize = new Sequelize(dbConfig);

module.exports = sequelize;
