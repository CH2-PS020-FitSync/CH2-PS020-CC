const { Op } = require('sequelize');
const { query } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  query('from')
    .optional()
    .isDate()
    .withMessage('From date should be in YYYY-MM-DD or YYYY/MM/DD format.'),
  query('to')
    .optional()
    .isDate()
    .withMessage('To date should be in YYYY-MM-DD or YYYY/MM/DD format.'),
];

async function bmisGetAll(req, res) {
  const dateFrom = req.matchedData.from;
  const dateTo = req.matchedData.to;

  const dateFromFilter = new Date(dateFrom);
  const dateToFilter = new Date(
    new Date(dateTo).getTime() + 24 * (60 * 60 * 1000) - 1000
  );

  const filters = {
    UserId: req.user.id,
  };

  if (dateFrom && dateTo) {
    filters.createdAt = {
      [Op.between]: [dateFromFilter, dateToFilter],
    };
  } else if (dateFrom) {
    filters.createdAt = {
      [Op.gte]: dateFromFilter,
    };
  } else if (dateTo) {
    filters.createdAt = {
      [Op.lte]: dateToFilter,
    };
  }

  const userBMIs = await db.bmis.findAll({
    where: filters,
    attributes: {
      exclude: 'UserId',
    },
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({
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

module.exports = [validate(validations), bmisGetAll];
