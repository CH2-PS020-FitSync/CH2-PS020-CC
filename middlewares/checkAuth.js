const jwt = require('jsonwebtoken');

const db = require('../models/index');

async function checkAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized. Need access token.',
    });
  }

  // Disabled by MD request
  // const accessToken = req.headers.authorization.trim().split(' ')[1];
  const accessToken = req.headers.authorization
    .replaceAll(/,?((B|b)earer)/g, '')
    .trim();

  try {
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );

    const user = await db.users.findByPk(decodedAccessToken.userId);

    if (!user) {
      throw new Error('User not found.');
    }

    req.user = user;

    return next();
  } catch (error) {
    let message;

    if (error instanceof jwt.TokenExpiredError) {
      message = 'Access token expired. Please refresh it.';
    } else {
      message = 'Unauthorized.';
    }

    return res.status(401).json({
      status: 'fail',
      message,
      error: error.message,
      fullToken: req.headers.authorization,
      accessToken,
    });
  }
}

module.exports = checkAuth;
