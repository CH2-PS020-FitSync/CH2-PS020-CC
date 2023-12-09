const { Op } = require('sequelize');
const { query } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Date should be in ISO 8601 format.'),
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Date should be in ISO 8601 format.'),
  query('orderType')
    .optional()
    .toLowerCase()
    .isIn(['asc', 'desc'])
    .withMessage('Order type should be [asc, desc] (case insensitive).')
    .toUpperCase(),
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limit should be integer. Minimum: 1.')
    .toInt(),
  query('offset')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Offset should be integer. Minimum: 1.')
    .toInt(),
];

async function bmisGetAll(req, res) {
  const {
    dateFrom,
    dateTo,
    orderType = 'desc',
    limit,
    offset,
  } = req.matchedData;

  const dateFromFilter = new Date(dateFrom);
  const dateToFilter = new Date(dateTo);

  const filters = {
    UserId: req.user.id,
  };

  if (dateFrom && dateTo) {
    filters.date = {
      [Op.between]: [dateFromFilter, dateToFilter],
    };
  } else if (dateFrom) {
    filters.date = {
      [Op.gte]: dateFromFilter,
    };
  } else if (dateTo) {
    filters.date = {
      [Op.lte]: dateToFilter,
    };
  }

  const queryOptions = {
    where: filters,
    attributes: {
      exclude: ['UserId'],
    },
    order: [['date', orderType]],
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
