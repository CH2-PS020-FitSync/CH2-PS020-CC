const bcrypt = require('bcrypt');
const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  body('userId')
    .exists()
    .withMessage('User id is required.')
    .custom(async (id) => {
      const user = await db.users.findByPk(id);
      if (!user) {
        throw new Error('User not found.');
      } else if (!user?.isVerified) {
        throw new Error('User is not verified.');
      } else {
        return true;
      }
    }),
  body('password')
    .exists()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password should have a minimum of 8 characters.'),
  body('passwordConfirmation')
    .exists()
    .withMessage('Password confirmation is required.')
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Password confirmation is not matches.');
      } else {
        return true;
      }
    }),
];

async function forgotPasswordChange(req, res) {
  const user = await db.users.findByPk(req.matchedData.userId);

  const plainPassword = req.matchedData.password;
  const saltRounds = 10;
  const encryptedPassword = await bcrypt.hash(plainPassword, saltRounds);

  await db.users.update(
    { password: encryptedPassword },
    { where: { id: user.id } }
  );

  res.status(200).json({
    status: 'success',
    message: 'User password successfully changed.',
    data: {
      user: {
        id: user.id,
      },
    },
  });
}

module.exports = [validate(validations), forgotPasswordChange];
