const db = require('../../models');

async function getBMIsController(req, res) {
  const userBMIs = await db.bmis.findAll({
    where: { UserId: req.user.id },
    attributes: {
      exclude: 'UserId',
    },
    order: [['updatedAt', 'DESC']],
  });
  res.status(200).json({
    status: 'success',
    message: 'User BMIs successfully retrieved.',
    data: {
      user: {
        id: req.user.id,
        bmis: userBMIs,
      },
    },
  });
}

module.exports = [getBMIsController];
