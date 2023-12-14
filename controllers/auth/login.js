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
    .custom(async (email, { req }) => {
      const user = await db.users.findOne({ where: { email } });

      if (!user) {
        throw new Error('Email not found.');
      } else if (!user?.isVerified) {
        throw new Error('User is not verified.');
      } else {
        req.user = user;
        return true;
      }
    }),
  body('password').exists().withMessage('Password is required.'),
];

async function loginController(req, res) {
  const isPasswordMatched = await bcrypt.compare(
    req.matchedData.password,
    req.user.password
  );

  if (!isPasswordMatched) {
    return res.status(400).json({
      status: 'fail',
      message: 'Password is incorrect.',
    });
  }

  const existedRefreshToken = await req.user.getRefreshToken();

  const jwtOptions = {
    issuer: 'FitSync',
  };

  const accessToken = jwt.sign(
    { userId: req.user.id },
    process.env.ACCESS_TOKEN_PRIVATE_KEY,
    {
      ...jwtOptions,
      expiresIn:
        process.env.ENVIRONMENT.toLowerCase() === 'development' ? '24h' : '30m',
    }
  );
  let refreshToken;

  if (existedRefreshToken) {
    refreshToken = existedRefreshToken.token;
  } else {
    refreshToken = jwt.sign(
      { userId: req.user.id },
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { ...jwtOptions }
    );
    await req.user.createRefreshToken({ token: refreshToken });
  }

  return res.status(200).json({
    status: 'success',
    message:
      'User successfully logged in. Access token and refresh token created.',
    user: {
      id: req.user.id,
      accessToken,
      refreshToken,
    },
  });
}

module.exports = [validate(validations), loginController];
