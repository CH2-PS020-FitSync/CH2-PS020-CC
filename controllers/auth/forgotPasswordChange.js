const { body } = require('express-validator');
const bcrypt = require('bcrypt');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  body('userId')
    .notEmpty()
    .withMessage('User id required.')
    .custom(async (id) => {
      const user = await db.users.findByPk(id);
      if (!user) {
        throw new Error("Can't find user.");
      } else if (!user?.isVerified) {
        throw new Error('User is not verified.');
      } else {
        return true;
      }
    }),
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
