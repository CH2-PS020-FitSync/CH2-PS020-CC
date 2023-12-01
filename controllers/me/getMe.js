function getMeController(req, res) {
  const { password, ...filteredUser } = req.user.toJSON();

  return res.status(200).json({
    status: 'success',
    message: 'User data found.',
    data: {
      user: filteredUser,
    },
  });
}

module.exports = [getMeController];
