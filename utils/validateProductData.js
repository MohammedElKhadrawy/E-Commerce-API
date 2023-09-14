const { body } = require('express-validator');

// important note: trim() sanitizer converts the value to a string!
// so a user might have actually entered a number,
// and the isString() AFTER trim() will actually accept it!!
// so we need to check isString() before trimming the value!

// 2nd important note: we HAVE TO trim() before isLength(),
// cuz if we don't, then isLength() will count the spaces!!

module.exports = () => {
  return [
    body('name', 'name must be between 3-100 characters')
      .isString()
      .trim()
      .isLength({ min: 3, max: 100 }),
    body('price')
      .notEmpty()
      .withMessage('price cannot be empty')
      .isNumeric()
      .withMessage('price must be a number'),
    body('description', 'description must be between 1-1000 characters')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 1000 }),
    body('category')
      .isString()
      .withMessage('category must be a string')
      .trim()
      .notEmpty()
      .withMessage('category cannot be empty'),
    body('company')
      .isString()
      .withMessage('company must be a string')
      .trim()
      .notEmpty()
      .withMessage('company cannot be empty'),
    body('colors')
      .isArray()
      .withMessage('please provide an array of color hex codes Ex: ["#222"]')
      .optional(),
    body('inventory').isInt({ min: 0 }).optional(),
    body('avgRating').isFloat({ min: 0, max: 5 }).optional(),
  ];
};
