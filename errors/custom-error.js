class CustomError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

module.exports = (message, statusCode, data) => {
  throw new CustomError(message, statusCode, data);
};
