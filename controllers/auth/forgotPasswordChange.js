const bcrypt = require('bcrypt');
const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  body('userId')
    .exists()
    .withMessage("User's id is required.")
    .custom(async (id, { req }) => {
      const user = await db.users.findByPk(id);

      if (!user) {
        throw new Error('User not found.');
      } else if (!user?.isVerified) {
        throw new Error('User is not verified.');
      } else {
        req.user = user;
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
        throw new Error('Password confirmation is not matched.');
      } else {
        return true;
      }
    }),
];

async function forgotPasswordChange(req, res) {
  const plainPassword = req.matchedData.password;
  const saltRounds = 10;
  const encryptedPassword = await bcrypt.hash(plainPassword, saltRounds);

  await db.users.update(
    { password: encryptedPassword },
    { where: { id: req.user.id } }
  );

  return res.status(200).json({
    status: 'success',
    message: "User's password successfully changed.",
    user: {
      id: req.user.id,
    },
  });
}

module.exports = [validate(validations), forgotPasswordChange];
