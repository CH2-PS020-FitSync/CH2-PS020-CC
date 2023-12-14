const { query } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  query('title').optional(),
  query('type')
    .optional()
    .toLowerCase()
    .isIn(['strength', 'stretching', 'aerobic'])
    .withMessage(
      'Type should be [strength, stretching, aerobic] (case insensitive).'
    ),
  query('level')
    .optional()
    .toLowerCase()
    .isIn(['beginner', 'intermediate', 'expert'])
    .withMessage(
      'Level should be [beginner, intermediate, expert] (case insensitive).'
    ),
  query('gender')
    .optional()
    .toLowerCase()
    .isIn(['male', 'female'])
    .withMessage('Gender should be [male, female] (case insensitive).'),
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

async function getAllController(req, res) {
  const {
    title = '*',
    type,
    level,
    gender,
    limit = 10,
    offset,
  } = req.matchedData;

  const searchParameters = {};
  const filters = [];

  searchParameters.q = title;
  searchParameters.query_by = 'title';

  if (type) {
    filters.push(`type:${type}`);
  }

  if (level) {
    filters.push(`level:${level}`);
  }

  if (gender) {
    filters.push(`gender:${gender}`);
  }

  if (filters.length > 0) {
    searchParameters.filter_by = filters.join(' && ');
  }

  searchParameters.limit = limit;

  if (offset) {
    searchParameters.offset = offset;
  }

  const searchResult = await db.typesense.exercises
    .documents()
    .search(searchParameters);

  let exercises = [];

  if (searchResult.found > 0) {
    exercises = searchResult.hits.map((hit) => hit.document);
  }

  return res.status(200).json({
    status: 'success',
    message: 'Exercises successfully retrieved.',
    exercises,
  });
}

module.exports = [validate(validations), getAllController];
