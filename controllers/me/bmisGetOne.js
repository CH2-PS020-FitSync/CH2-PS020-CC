const { param } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  param('id').custom(async (id) => {
    const bmi = await db.bmis.findByPk(id);
    if (!bmi) {
      throw new Error('BMI not found.');
    } else {
      return true;
    }
  }),
];

async function bmisGetOneController(req, res) {
  const bmi = await db.bmis.findByPk(req.matchedData.id);
  const { UserId, ...filteredBMI } = bmi.toJSON();
  const user = await bmi.getUser();

  if (user.id !== req.user.id) {
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden',
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'BMI successfully retrieved',
    data: {
      user: {
        id: user.id,
      },
      bmi: filteredBMI,
    },
  });
}

module.exports = [validate(validations), bmisGetOneController];