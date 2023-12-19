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
    .custom(async (refreshToken, { req }) => {
      const token = await db.refreshTokens.findOne({
        where: { token: refreshToken },
      });

      if (!token) {
        throw new Error('Refresh token not found.');
      } else {
        const expiredDaysInSeconds = 90 * 24 * 60 * 60; // 90 days;
        const lastAccessedSeconds = Math.round(
          new Date(token.lastAccessedAt).getTime() / 1000
        );
        const currentSeconds = Math.round(new Date().getTime() / 1000);
        const diffSeconds = currentSeconds - lastAccessedSeconds;

        if (diffSeconds > expiredDaysInSeconds) {
          await token.destroy();

          throw new Error('Refresh token expired.');
        } else {
          req.refreshToken = token;
          return true;
        }
      }
    }),
];

async function refreshTokenController(req, res) {
  try {
    const decodedRefreshToken = jwt.verify(
      req.matchedData.refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const jwtOptions = {
      issuer: 'FitSync',
    };

    const newAccessToken = jwt.sign(
      { userId: decodedRefreshToken.userId },
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      {
        ...jwtOptions,
        // Disabled by MD request
        // expiresIn:
        //   process.env.ENVIRONMENT.toLowerCase() === 'development'
        //     ? '24h'
        //     : '30m',
      }
    );

    await req.refreshToken.update({ lastAccessedAt: new Date() });

    return res.status(201).json({
      status: 'success',
      message: 'Access token updated.',
      user: {
        id: decodedRefreshToken.userId,
        accessToken: newAccessToken,
        refreshToken: req.matchedData.refreshToken,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: "Can't create access token.",
      error: error.message,
    });
  }
}

module.exports = [validate(validations), refreshTokenController];
