const { body } = require('express-validator');

const validate = require('../../middlewares/validate');

const validations = [
  body('email').isEmail().withMessage('Email is invalid.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password should have a minimum of 8 characters.'),
  body('passwordConfirmation').custom((passwordConfirmation, { req }) => {
    if (passwordConfirmation !== req.body.password) {
      throw new Error('Password confirmation is not matches.');
    } else {
      return true;
    }
  }),
  body('name').optional(),
  body('gender')
    .optional()
    .toLowerCase()
    .isIn(['male', 'female'])
    .withMessage('Gender should be [male, female] (case insensitive).'),
  body('birthDate')
    .optional()
    .isDate({ delimiters: '-' })
    .withMessage('Birth date should be in YYYY-MM-DD format.'),
  body('height').optional().isInt().withMessage('Height should be integer.'),
  body('weight').optional().isInt().withMessage('Weight should be integer.'),
  body('level')
    .optional()
    .toLowerCase()
    .isIn(['beginner, intermediate, expert'])
    .withMessage(
      'Level should be [beginner, intermediate, expert] (case insensitive).'
    ),
];

function registerUser(req, res) {
  res.send('Hello');
}

module.exports = [validate(validations), registerUser];
