const successResponse = (res, message, data, statusCode) => {
  res.status(statusCode).json({
    statusType: "SUCCESS",
    message,
    data,
  });
};

const errorResponse = (res, message, data, statusCode) => {
  res.status(statusCode).json({
    statusType: "ERROR / FAILED",
    message,
    data,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
