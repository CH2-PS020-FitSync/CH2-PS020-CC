const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');
const {
  generateOTPCode,
  OTP_TYPES,
  sendOTPToEmail,
} = require('../../helpers/otp');

const validations = [
  body('email')
    .exists()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email is invalid.')
    .custom(async (email, { req }) => {
      const user = await db.users.findOne({ where: { email } });

      if (!user) {
        throw new Error('User not found.');
      } else if (!user?.isVerified) {
        throw new Error('User is not verified.');
      } else {
        req.user = user;
        return true;
      }
    }),
];

async function forgotPasswordRequest(req, res) {
  const otp = await req.user.getOTP();

  const [plainOTPCode, encryptedOTPCode] = await generateOTPCode();

  await sendOTPToEmail({
    type: OTP_TYPES.FORGOT_PASSWORD,
    otpCode: plainOTPCode,
    to: req.user.email,
    name: req.user.name,
    smtpOptions: req.smtpOptions,
  });

  if (!otp) {
    await req.user.createOTP({ code: encryptedOTPCode });
  } else {
    await db.otps.update({ code: encryptedOTPCode }, { where: { id: otp.id } });
  }

  return res.status(200).json({
    status: 'success',
    message: 'OTP code successfully sent.',
    user: {
      id: req.user.id,
    },
  });
}

module.exports = [validate(validations), forgotPasswordRequest];
