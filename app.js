require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Core configurations
const logger = require("./core-configurations/logger-config/logger");
const sequelize = require("./core-configurations/sequelize-config/sequelize");

// Middlewares
const { verifyToken } = require("./middlewares/verifyToken");
const { errorHandler } = require("./middlewares/errorHandler");
const { notFoundHandler } = require("./middlewares/notFoundHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const borrowingRecordRoutes = require("./routes/borrowingRecordRoutes");
const penaltiesRoutes = require("./routes/penaltiesRoutes");

// DB Modules
const db = require("./models");

// Initialize Express app
const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// Request logging
app.use(morgan("combined"));

// Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Base route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Library Management System API",
    version: "1.0.0",
    documentation: `${process.env.BASE_URL}/docs`,
  });
});

// ----------------- PUBLIC ROUTES -----------------
app.use(`${process.env.BASE_URL}/auth`, authRoutes);

// ----------------- PRIVATE ROUTES -----------------
app.use(verifyToken);

app.use(`${process.env.BASE_URL}/users`, userRoutes);
app.use(`${process.env.BASE_URL}/roles`, roleRoutes);
app.use(`${process.env.BASE_URL}/books`, bookRoutes);
app.use(`${process.env.BASE_URL}/authors`, authorRoutes);
app.use(`${process.env.BASE_URL}/categories`, categoryRoutes);
app.use(`${process.env.BASE_URL}/borrow-records`, borrowingRecordRoutes);
app.use(`${process.env.BASE_URL}/penalties`, penaltiesRoutes);

// Error handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection and server startup
const PORT = process.env.PORT || 5001;

// Database Connection & Server Startup
db.sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connection established successfully.");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(
        `API Base URL: ${process.env.BASE_URL || `http://localhost:${PORT}`}`
      );
    });
  })
  .catch((err) => {
    logger.error("Database connection failed:", err);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});
