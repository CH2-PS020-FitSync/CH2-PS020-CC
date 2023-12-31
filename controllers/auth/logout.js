const checkAuth = require('../../middlewares/checkAuth');

async function logoutController(req, res) {
  const refreshToken = await req.user.getRefreshToken();

  if (!refreshToken) {
    return res.status(400).json({
      status: 'fail',
      message: 'User already logged out.',
    });
  }

  await refreshToken.destroy();

  return res.status(200).json({
    status: 'success',
    message: 'User successfully logged out. Refresh token destroyed.',
    user: {
      id: req.user.id,
    },
  });
}

module.exports = [checkAuth, logoutController];
