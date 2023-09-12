const throwCustomError = require('../errors/custom-error');
const { verifyToken } = require('../utils');

module.exports = async (req, res, next) => {
  const { token } = req.signedCookies;
  if (!token) {
    throwCustomError('Unauthenticated', 401);
  }
  let decodedToken;
  try {
    decodedToken = verifyToken(token);
  } catch (error) {
    throw error;
  }
  if (!decodedToken) {
    throwCustomError('Unauthenticated', 401);
  }
  req.user = {
    name: decodedToken.name,
    userId: decodedToken.userId,
    role: decodedToken.role,
  };
  next();
};
