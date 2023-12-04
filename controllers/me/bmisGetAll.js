const { Op } = require('sequelize');
const { query } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  query('order')
    .optional()
    .toLowerCase()
    .isIn(['asc', 'desc'])
    .withMessage('Order should be [asc, desc] (case insensitive).')
    .toUpperCase(),
  query('from')
    .optional()
    .isDate()
    .withMessage('From date should be in YYYY-MM-DD or YYYY/MM/DD format.'),
  query('to')
    .optional()
    .isDate()
    .withMessage('To date should be in YYYY-MM-DD or YYYY/MM/DD format.'),
  query('limit')
    .optional()
    .isInt()
    .withMessage('Limit should be integer.')
    .toInt(),
  query('offset')
    .optional()
    .isInt()
    .withMessage('Offset should be integer.')
    .toInt(),
];

async function bmisGetAll(req, res) {
  const {
    order = 'desc',
    from: dateFrom,
    to: dateTo,
    limit,
    offset,
  } = req.matchedData;

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

  const queryOptions = {
    where: filters,
    attributes: {
      exclude: ['UserId'],
    },
    order: [['createdAt', order]],
  };

  if (limit) {
    queryOptions.limit = limit;
  }

  if (offset) {
    queryOptions.offset = offset;
  }

  const userBMIs = await db.bmis.findAll(queryOptions);

  return res.status(200).json({
    status: 'success',
    message: 'User BMIs successfully retrieved.',
    bmis: userBMIs,
  });
}

module.exports = [validate(validations), bmisGetAll];
