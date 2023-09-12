const throwCustomError = require('../errors/custom-error');

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throwCustomError('Unauthorized to access this route', 403);
    }
    next();
  };
};
