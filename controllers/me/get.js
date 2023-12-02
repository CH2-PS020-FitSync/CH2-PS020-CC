async function getController(req, res) {
  const { password, ...filteredUser } = req.user.toJSON();
  const latestBMI = (
    await req.user.getBMIs({
      attributes: {
        exclude: ['UserId'],
      },
      order: [['createdAt', 'DESC']],
      limit: 1,
    })
  )[0];

  return res.status(200).json({
    status: 'success',
    message: 'User data found.',
    data: {
      user: {
        ...filteredUser,
        latestBMI,
      },
    },
  });
}

module.exports = [getController];
