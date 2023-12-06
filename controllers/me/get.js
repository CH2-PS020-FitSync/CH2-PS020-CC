async function getController(req, res) {
  const { password, ...filteredUser } = req.user.toJSON();
  const latestBMI = (
    await req.user.getBMIs({
      attributes: {
        exclude: ['UserId'],
      },
      order: [['date', 'DESC']],
      limit: 1,
    })
  )[0];

  return res.status(200).json({
    status: 'success',
    message: 'User successfully retrieved.',
    user: {
      ...filteredUser,
      latestBMI,
    },
  });
}

module.exports = [getController];
