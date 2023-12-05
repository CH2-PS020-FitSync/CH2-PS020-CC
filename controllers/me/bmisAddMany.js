const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  body('bmis').exists().withMessage('BMIs is required'),
  body('bmis.*.height')
    .exists()
    .withMessage('Height is required.')
    .isFloat()
    .withMessage('Height should be float.'),
  body('bmis.*.weight')
    .exists()
    .withMessage('Weight is required.')
    .isFloat()
    .withMessage('Weight should be float.'),
  body('bmis.*.date')
    .optional()
    .isISO8601()
    .withMessage('Date should be in ISO 8601 format.'),
];

async function bmisAddManyController(req, res) {
  const newBMIs = await db.bmis.bulkCreate(
    req.matchedData.bmis.map((newBMI) => ({
      ...newBMI,
      UserId: req.user.id,
    }))
  );

  const filteredNewBMIs = newBMIs.map((newBMI) => {
    const { UserId, ...filteredNewBMI } = newBMI.toJSON();
    return filteredNewBMI;
  });

  return res.status(201).json({
    status: 'success',
    message: 'BMIs succesfully added.',
    bmis: filteredNewBMIs,
  });
}

module.exports = [validate(validations), bmisAddManyController];
