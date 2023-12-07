const { Op } = require('sequelize');
const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  body('height')
    .exists()
    .withMessage('Height is required.')
    .isFloat()
    .withMessage('Height should be float.'),
  body('weight')
    .exists()
    .withMessage('Weight is required.')
    .isFloat()
    .withMessage('Weight should be float.'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date should be in ISO 8601 format.'),
];

async function bmisPutOneController(req, res) {
  const { height, weight, date } = req.matchedData;

  const bmiDate = date ? new Date(date) : new Date();
  const startDate = bmiDate.setHours(0, 0, 0);
  const endDate = bmiDate.setHours(23, 59, 59);

  let bmi = await db.bmis.findOne({
    where: {
      date: { [Op.between]: [startDate, endDate] },
      UserId: req.user.id,
    },
  });
  let isUpdate = false;

  if (bmi) {
    bmi.set({
      height,
      weight,
      date: bmiDate,
    });
    await bmi.save();
    isUpdate = true;
  } else {
    bmi = await req.user.createBMI(req.matchedData);
  }

  const { UserId, ...filteredBMI } = bmi.toJSON();

  return res.status(isUpdate ? 200 : 201).json({
    status: 'success',
    message: `BMI succesfully ${isUpdate ? 'updated' : 'added'}.`,
    bmi: filteredBMI,
  });
}

module.exports = [validate(validations), bmisPutOneController];
