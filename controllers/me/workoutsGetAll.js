const { Op } = require('sequelize');
const { query } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  query('detail')
    .optional()
    .isBoolean()
    .withMessage('Detail should be boolean [true, false, 0, 1].')
    .toBoolean(true),
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Date-from should be in ISO 8601 format.'),
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Date-to should be in ISO 8601 format.'),
  query('ratingFrom')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Rating-from should be in 1-10 range.')
    .toInt()
    .custom((ratingFrom, { req }) => {
      const { ratingTo } = req.query;

      if (ratingTo && ratingTo < ratingFrom) {
        throw new Error('Rating-from should be lesser than rating-to.');
      } else {
        return true;
      }
    }),
  query('ratingTo')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Rating-to should be in 1-10 range.')
    .toInt()
    .custom((ratingTo, { req }) => {
      const { ratingFrom } = req.query;

      if (ratingFrom && ratingFrom > ratingTo) {
        throw new Error('Rating-to should be greater than rating-from.');
      } else {
        return true;
      }
    }),
  query('orderType')
    .optional()
    .toLowerCase()
    .isIn(['asc', 'desc'])
    .withMessage('Order type should be [asc, desc] (case insensitive).')
    .toUpperCase(),
  query('limit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Limit should be integer. Minimum: 0.')
    .toInt(),
  query('offset')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Offset should be integer. Minimum: 1.')
    .toInt(),
];

async function workoutsGetAll(req, res) {
  const {
    dateFrom,
    dateTo,
    ratingFrom,
    ratingTo,
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

  if (ratingFrom && ratingTo) {
    filters.rating = {
      [Op.between]: [ratingFrom, ratingTo],
    };
  } else if (ratingFrom) {
    filters.rating = {
      [Op.gte]: ratingFrom,
    };
  } else if (ratingTo) {
    filters.rating = {
      [Op.lte]: ratingTo,
    };
  }

  const queryOptions = {
    where: filters,
    attributes: [
      'id',
      ['ExerciseId', 'exerciseId'],
      'rating',
      'date',
      'createdAt',
      'updatedAt',
    ],
    order: [['date', orderType]],
  };

  if (limit > 0) {
    queryOptions.limit = limit;
  } else if (limit !== 0) {
    queryOptions.limit = 10;
  }

  if (offset) {
    queryOptions.offset = offset;
  }

  const workouts = await db.workouts.findAll(queryOptions);

  let finalWorkouts = workouts;

  if (req.matchedData.detail) {
    finalWorkouts = [];

    for (const workout of workouts) {
      const { exerciseId, ...filteredWorkout } = workout.toJSON();

      const exercise = await db.typesense.exercises
        .documents(exerciseId)
        .retrieve();

      finalWorkouts.push({
        ...filteredWorkout,
        exercise,
      });
    }
  }

  return res.status(200).json({
    status: 'success',
    message: "User's workouts successfully retrieved.",
    workouts: finalWorkouts,
  });
}

module.exports = [validate(validations), workoutsGetAll];
