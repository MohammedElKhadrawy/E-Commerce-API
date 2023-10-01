const { body } = require('express-validator');

// important note: trim() sanitizer converts the value to a string!
// so a user might have actually entered a number,
// and the isString() AFTER trim() will actually accept it!!
// so we need to check isString() before trimming the value!

// 2nd important note: we HAVE TO trim() before isLength(),
// cuz if we don't, then isLength() will count the spaces!!

module.exports = ({ isOptional } = {}) => {
  const middlewares = [
    body('name', 'name must be a string between 3-100 characters')
      .isString()
      .trim()
      .isLength({ min: 3, max: 100 }),
    body('price', 'price must be a valid number')
      .notEmpty()
      .isFloat({ min: 0 }),
    body(
      'description',
      'description must be a string between 1-1000 characters'
    )
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 1000 }),
    body('category', 'category must be a valid string')
      .isString()
      .trim()
      .notEmpty(),
    body('company', 'company must be a valid string')
      .isString()
      .trim()
      .notEmpty(),
    body('inventory').isInt({ min: 0 }).optional(),
  ];

  if (isOptional) {
    return middlewares.map((middleware) => middleware.optional());
  } else {
    return middlewares;
  }
};
