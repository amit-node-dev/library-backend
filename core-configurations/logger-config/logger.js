const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');
const dotenv = require("dotenv");

// Load the appropriate .env file
dotenv.config();

// Ensure logs directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define custom format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// Create logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
      )
    }),
    new transports.File({
      filename: path.join(logDir, 'app.log'),
      maxsize: 5 * 1024 * 1024, 
      maxFiles: 3
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, 'app.log') })
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, 'app.log') })
  ],
  exitOnError: false
});

// Optional: catch unhandled promise rejections globally
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

module.exports = logger;
