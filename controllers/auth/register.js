const { body } = require('express-validator');
const bcrypt = require('bcrypt');

const db = require('../../models');
const validate = require('../../middlewares/validate');
const { generateOTPCode } = require('../../helpers/otp');

const validations = [
  body('email')
    .isEmail()
    .withMessage('Email is invalid.')
    .custom(async (email) => {
      const user = await db.users.findOne({ where: { email } });
      if (user?.isVerified) {
        throw new Error('Email already used and verified.');
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
  body('height')
    .optional()
    .isFloat()
    .withMessage('Height should be float.')
    .custom((height, { req }) => {
      if (req.weight) {
        throw new Error('Height should paired with weight.');
      } else {
        return true;
      }
    }),
  body('weight')
    .optional()
    .isFloat()
    .withMessage('Weight should be float.')
    .custom((weight, { req }) => {
      if (req.height) {
        throw new Error('Weight should paired with height.');
      } else {
        return true;
      }
    }),
];

async function registerUser(req, res) {
  const plainPassword = req.matchedData.password;
  const saltRounds = 10;
  const encryptedPassword = await bcrypt.hash(plainPassword, saltRounds);

  const [plainOTPCode, encryptedOTPCode] = await generateOTPCode();
  console.log(plainOTPCode);

  const userData = {
    email: req.matchedData.email,
    password: encryptedPassword,
    name: req.matchedData.name || null,
    gender: req.matchedData.gender || null,
    birthDate: req.matchedData.birthDate || null,
    level: req.matchedData.level || null,
    goalWeight: req.matchedData.goalWeight || null,
  };

  const bmiData = {
    height: req.matchedData.height,
    weight: req.matchedData.weight,
  };

  const existedUser = await db.users.findOne({
    where: { email: req.matchedData.email },
  });
  let user;

  if (existedUser) {
    user = existedUser;
    await db.users.update(userData, { where: { id: user.id } });

    if (req.matchedData.height && req.matchedData.weight) {
      await user.createBMI(bmiData);
    }

    const otp = await user.getOTP();
    await db.otps.update({ code: encryptedOTPCode }, { where: { id: otp.id } });
  } else {
    user = await db.users.create(userData);

    if (req.matchedData.height && req.matchedData.weight) {
      await user.createBMI(bmiData);
    }

    await user.createOTP({ code: encryptedOTPCode });
  }

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully. OTP code sent.',
    data: {
      user: {
        id: user.id,
      },
    },
  });
}

module.exports = [validate(validations), registerUser];
