const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');
const { generateOTPCode, sendOTPToEmail } = require('../../helpers/otp');

const validations = [
  body('email')
    .exists()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email is invalid.')
    .custom(async (email) => {
      const user = await db.users.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found.');
      } else if (!user?.isVerified) {
        throw new Error('User is not verified.');
      } else {
        return true;
      }
    }),
];

async function forgotPasswordRequest(req, res) {
  const user = await db.users.findOne({
    where: { email: req.matchedData.email },
  });
  const otp = await user.getOTP();

  const [plainOTPCode, encryptedOTPCode] = await generateOTPCode();

  await sendOTPToEmail({
    type: 'forgot-password',
    otpCode: plainOTPCode,
    to: user.email,
    name: user.name,
    smtpOptions: req.smtpOptions,
  });

  if (!otp) {
    await user.createOTP({ code: encryptedOTPCode });
  } else {
    await db.otps.update({ code: encryptedOTPCode }, { where: { id: otp.id } });
  }

  return res.status(200).json({
    status: 'success',
    message: 'OTP code successfully sent.',
    user: {
      id: user.id,
    },
  });
}

module.exports = [validate(validations), forgotPasswordRequest];
