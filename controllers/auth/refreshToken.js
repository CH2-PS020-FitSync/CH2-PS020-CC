const jwt = require('jsonwebtoken');
const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  body('refreshToken')
    .exists()
    .withMessage('Refresh token is required.')
    .isJWT()
    .withMessage('Refresh token should be JWT.')
    .custom(async (refreshToken) => {
      const token = await db.refreshTokens.findOne({
        where: { token: refreshToken },
      });
      if (!token) {
        throw new Error('Refresh token not found.');
      } else {
        return true;
      }
    }),
];

async function refreshTokenController(req, res) {
  try {
    const decodedRefreshToken = jwt.verify(
      req.matchedData.refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const newAccessToken = jwt.sign(
      { userId: decodedRefreshToken.userId },
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { issuer: 'FitSync', expiresIn: '10m' }
    );

    return res.status(201).json({
      status: 'success',
      message: 'Access token updated.',
      data: {
        user: {
          id: decodedRefreshToken.userId,
        },
        accessToken: newAccessToken,
        refreshToken: req.matchedData.refreshToken,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: "Can't create access token.",
      error,
    });
  }
}

module.exports = [validate(validations), refreshTokenController];
