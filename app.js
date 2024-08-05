const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

// CORE CONFIG MODULES
const logger = require("./core-configurations/logger-config/logger");
const sequelize = require("./core-configurations/sequelize-config/sequelize");

// MIDDLEWARES MODULES
const { verifyToken } = require("./middlewares/verifyToken");

// DB MODELS MODULES
const db = require("./models");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TEST ROUTES
app.get("/", (req, res) => {
  res.status(200).send("HELLO WORLD....");
});

// ---------------- PUBLIC ROUTES -----------------------

// AUTH ROUTES
app.use(`${process.env.BASE_URL}/auth`, authRoutes);

// ---------------- PRIVATE ROUTES -----------------------
app.use(verifyToken);

// USER ROUTES
app.use(`${process.env.BASE_URL}/users`, userRoutes);

// ROLE ROUTES
app.use(`${process.env.BASE_URL}/roles`, roleRoutes);

// BOOKS ROUTES
app.use(`${process.env.BASE_URL}/books`, bookRoutes);

// AUTHORS ROUTES
app.use(`${process.env.BASE_URL}/authors`, authorRoutes);

// CATEGORIES ROUTES
app.use(`${process.env.BASE_URL}/categories`, categoryRoutes);

// AUTHENTICATE SEQUELIZE AND ESTABLISH CONNECTION WITH DB
db.sequelize
  .authenticate()
  .then(() => {
    logger.info("Connection has been established successfully.");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () =>
      logger.info(`Server is running on PORT ::: ${PORT}`)
    );
  })
  .catch((err) => {
    logger.info("Unable to connect to the database:", err);
  });
