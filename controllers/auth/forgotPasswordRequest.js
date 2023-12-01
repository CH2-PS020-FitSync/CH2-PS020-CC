const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');
const { generateOTPCode } = require('../../helpers/otp');

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
];

async function forgotPasswordRequest(req, res) {
  const user = await db.users.findByPk(req.matchedData.userId);
  const otp = await user.getOTP();

  const [plainOTPCode, encryptedOTPCode] = await generateOTPCode();
  console.log(plainOTPCode);

  if (!otp) {
    await user.createOTP({ code: encryptedOTPCode });
  } else {
    await db.otps.update({ code: encryptedOTPCode }, { where: { id: otp.id } });
  }

  return res.status(200).json({
    status: 'success',
    message: 'OTP code successfully sent.',
    data: {
      user: {
        id: user.id,
      },
    },
  });
}

module.exports = [validate(validations), forgotPasswordRequest];
