const { User, Penalty, Role } = require("../models");

// GET ALL LIST OF USERS
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

    // Building the where condition for search
    const whereCondition = {};

    if (search) {
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
        user_fullname: `${penalty.user.firstname} ${penalty.user.lastname}`,
        book_id: penalty.book_id,
        book_name: penalty.book.bookname,
        fine: penalty.fine,
        createdAt: penalty.createdAt,
      })),
      total: count,
      page: parseInt(page, 10),
      itemsPerPage: limit,
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

// ADD PENALTIES
const addPenalty = async (req, res) => {
  try {
    logger.info("penaltiesControllers --> addPenalty --> reached");
    const { name } = req.body;

    const role = await Role.create({ name });

    logger.info("penaltiesControllers --> addPenalty --> ended");
    return successResponse(res, message.COMMON.ADDED_SUCCESS, role, 201);
  } catch (error) {
    logger.error("penaltiesControllers --> addPenalty --> error", error);
    return errorResponse(
      res,
      message.SERVER.INTERNAL_SERVER_ERROR,
      error.message,
      500
    );
  }
};

module.exports = { getAllPenaltyList, addPenalty };
