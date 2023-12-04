const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  body('email')
    .exists()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email is invalid.')
    .custom(async (email) => {
      const user = await db.users.findOne({ where: { email } });
      if (!user) {
        throw new Error('Email not found.');
      } else if (!user?.isVerified) {
        throw new Error('User not verified.');
      } else {
        return true;
      }
    }),
  body('password').exists().withMessage('Password is required.'),
];

async function loginController(req, res) {
  const user = await db.users.findOne({
    where: { email: req.matchedData.email },
  });

  const isPasswordMatched = await bcrypt.compare(
    req.matchedData.password,
    user.password
  );

  if (!isPasswordMatched) {
    return res.status(400).json({
      status: 'fail',
      message: 'Password is incorrect.',
    });
  }

  const existedRefreshToken = await user.getRefreshToken();

  const jwtOptions = {
    issuer: 'FitSync',
  };

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_PRIVATE_KEY,
    {
      ...jwtOptions,
      expiresIn: process.env.ENVIRONMENT === 'production' ? '15m' : '24h',
    }
  );
  let refreshToken;

  if (existedRefreshToken) {
    refreshToken = existedRefreshToken.token;
  } else {
    refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { ...jwtOptions }
    );
    await user.createRefreshToken({ token: refreshToken });
  }

  return res.status(201).json({
    status: 'success',
    message:
      'User successfully logged in. Access token and refresh token created.',
    user: {
      id: user.id,
      accessToken,
      refreshToken,
    },
  });
}

module.exports = [validate(validations), loginController];
