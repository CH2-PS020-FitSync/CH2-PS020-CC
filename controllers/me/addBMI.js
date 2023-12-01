const { body } = require('express-validator');

const validate = require('../../middlewares/validate');

const validations = [
  body('height')
    .notEmpty()
    .withMessage('Height is required.')
    .isFloat()
    .withMessage('Height should be float.'),
  body('weight')
    .notEmpty()
    .withMessage('Weight is required.')
    .isFloat()
    .withMessage('Weight should be float.'),
];

async function addBMIController(req, res) {
  const newBMI = await req.user.createBMI(req.matchedData);
  const { UserId, ...filteredNewBMI } = newBMI.toJSON();

  return res.status(201).json({
    status: 'success',
    message: 'BMI succesfully added.',
    data: {
      user: {
        id: req.user.id,
      },
      bmi: filteredNewBMI,
    },
  });
}

module.exports = [validate(validations), addBMIController];
