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
];

async function patchController(req, res) {
  await db.users.update(req.matchedData, {
    where: { id: req.user.id },
  });

  const patchedUser = await db.users.findByPk(req.user.id);
  const { password, ...filteredPatchedUser } = patchedUser.toJSON();

  return res.status(200).json({
    status: 'success',
    message: 'User successfully patched.',
    data: {
      user: filteredPatchedUser,
    },
  });
}

module.exports = [validate(validations), patchController];
