const bcrypt = require('bcrypt');
const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');
const { isOTPCodeExpired } = require('../../helpers/otp');

const validations = [
  body('userId')
    .exists()
    .withMessage('User id is required.')
    .custom(async (id) => {
      const user = await db.users.findByPk(id);
      if (!user) {
        throw new Error('User not found.');
      } else if (user?.isVerified) {
        throw new Error('User already verified.');
      } else {
        return true;
      }
    }),
  body('code')
    .exists()
    .withMessage('OTP code is required.')
    .isLength({ min: 4, max: 4 })
    .withMessage('OTP code should be 4 characters.'),
];

async function registerOTPController(req, res) {
  const user = await db.users.findByPk(req.matchedData.userId);
  const otp = await user.getOTP();

  if (!otp) {
    return res.status(400).json({
      status: 'fail',
      message: "User doesn't have an active OTP code.",
    });
  }

  if (isOTPCodeExpired(new Date(otp.updatedAt))) {
    return res.status(400).json({
      status: 'fail',
      message: 'Session expired.',
    });
  }

  const isOTPCodeMatched = await bcrypt.compare(req.matchedData.code, otp.code);
  if (!isOTPCodeMatched) {
    return res.status(400).json({
      status: 'fail',
      message: 'OTP code is incorrect.',
    });
  }

  await db.users.update({ isVerified: true }, { where: { id: user.id } });
  await otp.destroy();

  return res.status(200).json({
    status: 'success',
    message: 'User sucessfully verified.',
    data: {
      user: {
        id: user.id,
      },
    },
  });
}

module.exports = [validate(validations), registerOTPController];
