const checkAuth = require('../../middlewares/checkAuth');

async function logoutController(req, res) {
  const refreshToken = await req.user.getRefreshToken();
  await refreshToken.destroy();

  res.status(200).json({
    status: 'success',
    message: 'User successfully logged out.',
    data: {
      user: {
        id: req.user.id,
      },
    },
  });
}

module.exports = [checkAuth, logoutController];
