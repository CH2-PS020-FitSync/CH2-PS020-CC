const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');
const { generateOTPCode } = require('../../helpers/otp');

const validations = [
  body('userId')
    .exists()
    .withMessage('User id is required.')
    .custom(async (id) => {
      const user = await db.users.findByPk(id);
      if (!user) {
        throw new Error('User not found.');
      } else {
        return true;
      }
    }),
];

async function otpRefreshController(req, res) {
  const user = await db.users.findByPk(req.body.userId);
  const otp = await user.getOTP();

  if (!otp) {
    return res.status(400).json({
      status: 'fail',
      message: "User doesn't have an active OTP code.",
    });
  }

  const [plainOTPCode, encryptedOTPCode] = await generateOTPCode();
  console.log(plainOTPCode);

  await db.otps.update({ code: encryptedOTPCode }, { where: { id: otp.id } });

  return res.status(201).json({
    status: 'success',
    message: 'OTP code successfully refreshed and sent.',
    data: {
      user: {
        id: user.id,
      },
    },
  });
}

module.exports = [validate(validations), otpRefreshController];
