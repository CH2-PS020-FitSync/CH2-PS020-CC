const jwt = require('jsonwebtoken');

const db = require('../models/index');

async function checkAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized.',
    });
  }

  const accessToken = req.headers.authorization.split(' ')[1];

  try {
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );

    const user = await db.users.findByPk(decodedAccessToken.userId);
    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized.',
    });
  }
}

module.exports = checkAuth;
