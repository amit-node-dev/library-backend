const { User, Penalty, Book } = require("../models");

// CORE CONFIG
const logger = require("../core-configurations/logger-config/logger");

// UTILS
const { successResponse, errorResponse } = require("../utils/handleResponse");
const message = require("../utils/commonMessages");
const { Op } = require("sequelize");

// GET ALL LIST OF PENALTY
const getAllPenaltyList = async (req, res) => {
  try {
    logger.info("penaltiesControllers --> getAllPenaltyList --> reached");

    // Extract query parameters with default values
    const {
      page = 1,
      pageSize = 5,
      search = "",
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
    const limit = parseInt(pageSize, 10);

    // Define the where condition for searching
    const whereCondition = {};
    if (search.trim() !== "") {
      whereCondition[Op.or] = [
        { "$user.firstname$": { [Op.iLike]: `%${search}%` } },
        { "$user.lastname$": { [Op.iLike]: `%${search}%` } },
        { "$book.bookname$": { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Fetch penalties with related book and user information
    const { count, rows } = await Penalty.findAndCountAll({
      where: whereCondition,
      offset,
      limit,
      order: [[sortBy, sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstname", "lastname"],
        },
        {
          model: Book,
          as: "book",
          attributes: ["id", "bookname"],
        },
      ],
    });

    // Format response data
    const responseData = {
      items: rows.map((penalty) => ({
        id: penalty.id,
        user_id: penalty.user_id,
        fullname: `${penalty.user.firstname} ${penalty.user.lastname}`,
        book_id: penalty.book_id,
        bookname: penalty.book.bookname,
        fine: penalty.fine,
        createdAt: penalty.createdAt,
      })),
      total: count,
      page: parseInt(page, 10),
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
    };

    logger.info("penaltiesControllers --> getAllPenaltyList --> ended");
    return successResponse(
      res,
      message.COMMON.LIST_FETCH_SUCCESS,
      responseData,
      200
    );
  } catch (error) {
    logger.error("penaltiesControllers --> getAllPenaltyList --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

module.exports = { getAllPenaltyList };
