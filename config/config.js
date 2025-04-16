require('dotenv').config();

const commonConfig = {
  dialect: 'mysql',
  logging: process.env.MYSQL_LOGGING === 'true' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
};

const baseConfig = {
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT || 3306,
  ...commonConfig,
};

const config = {
  development: baseConfig,
  test: baseConfig,
  production: {
    ...baseConfig,
    pool: {
      max: 15,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
  },
};

module.exports = config;