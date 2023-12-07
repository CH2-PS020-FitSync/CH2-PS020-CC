const { Op } = require('sequelize');
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

async function bmisPutManyController(req, res) {
  const bmis = [];

  for (const bmiItem of req.matchedData.bmis) {
    const { height, weight, date } = bmiItem;

    const bmiDate = date ? new Date(date) : new Date();
    const startDate = bmiDate.setHours(0, 0, 0);
    const endDate = bmiDate.setHours(23, 59, 59);

    let bmi = await db.bmis.findOne({
      where: {
        date: { [Op.between]: [startDate, endDate] },
        UserId: req.user.id,
      },
    });

    if (bmi) {
      bmi.set({
        height,
        weight,
        date: bmiDate,
      });
      await bmi.save();
    } else {
      bmi = await req.user.createBMI(bmiItem);
    }

    const { UserId, ...filteredBMI } = bmi.toJSON();

    bmis.push(filteredBMI);
  }

  return res.status(200).json({
    status: 'success',
    message: 'BMIs succesfully added.',
    bmis,
  });
}

module.exports = [validate(validations), bmisPutManyController];
