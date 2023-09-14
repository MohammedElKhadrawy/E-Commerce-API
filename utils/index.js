const { attachCookiesToResponse, verifyToken } = require('./jwt');
const collectValidationResult = require('./collectValidationResult');
const createTokenUser = require('./createTokenUser');
const validateProductData = require('./validateProductData');
const {
  validateNameAndEmail,
  validatePassword,
} = require('./validateUserData');

module.exports = {
  attachCookiesToResponse,
  verifyToken,
  collectValidationResult,
  createTokenUser,
  validateNameAndEmail,
  validatePassword,
  validateProductData,
};
