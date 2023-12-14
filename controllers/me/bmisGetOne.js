const { param } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  param('id').custom(async (id, { req }) => {
    const bmi = await db.bmis.findByPk(id);

    if (!bmi) {
      throw new Error('BMI not found.');
    } else {
      req.bmi = bmi;
      return true;
    }
  }),
];

async function bmisGetOneController(req, res) {
  const user = await req.bmi.getUser();

  if (user.id !== req.user.id) {
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden.',
    });
  }

  const { UserId, ...filteredBMI } = req.bmi.toJSON();

  return res.status(200).json({
    status: 'success',
    message: "User's BMI successfully retrieved.",
    bmi: filteredBMI,
  });
}

module.exports = [validate(validations), bmisGetOneController];
