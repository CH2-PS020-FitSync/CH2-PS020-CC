const { Op } = require('sequelize');
const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  body('name').optional(),
  body('gender')
    .optional()
    .toLowerCase()
    .isIn(['male', 'female'])
    .withMessage('Gender should be [male, female] (case insensitive).'),
  body('birthDate')
    .optional()
    .isDate()
    .withMessage('Birth date should be in YYYY-MM-DD or YYYY/MM/DD format.'),
  body('level')
    .optional()
    .toLowerCase()
    .isIn(['beginner', 'intermediate', 'expert'])
    .withMessage(
      'Level should be [beginner, intermediate, expert] (case insensitive).'
    ),
  body('goalWeight')
    .optional()
    .isFloat()
    .withMessage('Goal weight should be float'),
  body('height')
    .optional()
    .isFloat()
    .withMessage('Height should be float.')
    .custom((height, { req }) => {
      if (!req.body.weight) {
        throw new Error('Height should paired with weight.');
      } else {
        return true;
      }
    }),
  body('weight')
    .optional()
    .isFloat()
    .withMessage('Weight should be float.')
    .custom((weight, { req }) => {
      if (!req.body.height) {
        throw new Error('Weight should paired with height.');
      } else {
        return true;
      }
    }),
];

async function patchController(req, res) {
  await db.users.update(req.matchedData, {
    where: { id: req.user.id },
  });

  const bmiData = {
    height: req.matchedData.height,
    weight: req.matchedData.weight,
  };

  if (bmiData.height && bmiData.weight) {
    const bmiDate = new Date();
    const startDate = new Date(bmiDate).setUTCHours(0, 0, 0);
    const endDate = new Date(bmiDate).setUTCHours(23, 59, 59);

    const bmi = await db.bmis.findOne({
      where: {
        date: { [Op.between]: [startDate, endDate] },
        UserId: req.user.id,
      },
    });

    if (bmi) {
      await db.bmis.update(
        {
          height: bmiData.height,
          weight: bmiData.weight,
          date: bmiDate,
        },
        { where: { id: bmi.id } }
      );
    } else {
      await req.user.createBMI(bmiData);
    }
  }

  const patchedUser = await db.users.findByPk(req.user.id);
  const { password, ...filteredPatchedUser } = patchedUser.toJSON();

  const latestBMI = (
    await patchedUser.getBMIs({
      attributes: {
        exclude: ['UserId'],
      },
      order: [['date', 'DESC']],
      limit: 1,
    })
  )[0];

  return res.status(200).json({
    status: 'success',
    message: 'User successfully patched.',
    user: {
      ...filteredPatchedUser,
      latestBMI,
    },
  });
}

module.exports = [validate(validations), patchController];
