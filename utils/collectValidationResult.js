const { validationResult } = require('express-validator');

const throwCustomError = require('../errors/custom-error');

module.exports = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    extractedErrors = errors.array().map((err) => err.msg);

    let msg = 'Validation Failed';
    let statusCode = 422;
    if (req.method === 'POST' && req.originalUrl === '/api/v1/auth/login') {
      msg = 'Please provide E-Mail and Password';
      statusCode = 400; // Bad request!
    }
    if (
      req.method === 'PATCH' &&
      req.originalUrl === '/api/v1/users/updateUserPassword'
    ) {
      msg = 'Bad request';
      statusCode = 400;
    }
    throwCustomError(msg, statusCode, extractedErrors);
  }
};
