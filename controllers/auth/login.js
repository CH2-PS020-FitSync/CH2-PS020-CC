const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  body('email')
    .isEmail()
    .withMessage('Email is invalid')
    .custom(async (email) => {
      const user = await db.users.findOne({ where: { email } });
      if (!user) {
        throw new Error('Email is not found.');
      } else if (!user?.isVerified) {
        throw new Error('User is not verified.');
      } else {
        return true;
      }
    }),
  body('password').notEmpty().withMessage('Password is required.'),
];

async function loginController(req, res) {
  const user = await db.users.findOne({
    where: { email: req.matchedData.email },
  });

  const existedRefreshToken = await user.getRefreshToken();

  if (existedRefreshToken) {
    return res.status(400).json({
      status: 'fail',
      message: 'User already logged in.',
    });
  }

  const isPasswordMatched = await bcrypt.compare(
    req.matchedData.password,
    user.password
  );

  if (!isPasswordMatched) {
    return res.status(400).json({
      status: 'fail',
      message: 'Password is wrong.',
    });
  }

  const jwtOptions = {
    issuer: 'FitSync',
  };

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_PRIVATE_KEY,
    { ...jwtOptions, expiresIn: '10m' }
  );
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_PRIVATE_KEY,
    { ...jwtOptions }
  );

  await user.createRefreshToken({ token: refreshToken });

  return res.status(201).json({
    status: 'success',
    message: 'Access token and refresh token successfully created.',
    data: {
      user: {
        id: user.id,
      },
      accessToken,
      refreshToken,
    },
  });
}

module.exports = [validate(validations), loginController];
