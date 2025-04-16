const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logDirectory = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Custom log format with colorization
const logFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }), 
  format((info) => {
    if (info instanceof Error) {
      return Object.assign({}, info, {
        message: info.message,
        stack: info.stack
      });
    }
    return info;
  })(),
  printf(({ level, message, timestamp, stack }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  })
);

// Console transport with colorization
const consoleTransport = new transports.Console({
  format: combine(
    colorize(),
    logFormat
  ),
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});

// File transports with rotation
const fileTransport = new transports.File({
  filename: path.join(logDirectory, 'combined.log'),
  level: 'info',
  maxsize: 5242880, 
  maxFiles: 5
});

const errorFileTransport = new transports.File({
  filename: path.join(logDirectory, 'error.log'),
  level: 'error',
  maxsize: 5242880,
  maxFiles: 5
});

// Logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    consoleTransport,
    fileTransport,
    errorFileTransport
  ],
  exceptionHandlers: [
    new transports.File({ 
      filename: path.join(logDirectory, 'exceptions.log') 
    })
  ],
  rejectionHandlers: [
    new transports.File({ 
      filename: path.join(logDirectory, 'rejections.log') 
    })
  ],
  exitOnError: false 
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

module.exports = logger;