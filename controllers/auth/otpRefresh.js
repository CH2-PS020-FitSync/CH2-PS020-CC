const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');
const {
  generateOTPCode,
  OTP_TYPES,
  sendOTPToEmail,
} = require('../../helpers/otp');

const validations = [
  body('userId')
    .exists()
    .withMessage("User's id is required.")
    .custom(async (id, { req }) => {
      const user = await db.users.findByPk(id);

      if (!user) {
        throw new Error('User not found.');
      } else {
        req.user = user;
        return true;
      }
    }),
];

async function otpRefreshController(req, res) {
  const otp = await req.user.getOTP();

  if (!otp) {
    return res.status(400).json({
      status: 'fail',
      message: "User doesn't have an active OTP code.",
    });
  }

  const [plainOTPCode, encryptedOTPCode] = await generateOTPCode();
  await sendOTPToEmail({
    type: req.user.isVerified ? OTP_TYPES.FORGOT_PASSWORD : OTP_TYPES.REGISTER,
    otpCode: plainOTPCode,
    to: req.user.email,
    name: req.user.name,
    smtpOptions: req.smtpOptions,
  });

  await db.otps.update({ code: encryptedOTPCode }, { where: { id: otp.id } });

  return res.status(200).json({
    status: 'success',
    message: 'OTP code successfully refreshed and sent.',
    user: {
      id: req.user.id,
    },
  });
}

module.exports = [validate(validations), otpRefreshController];
