const { query } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  query('titleStartsWith').optional(),
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
  const { titleStartsWith, type, level, gender, limit, offset } =
    req.matchedData;

  let exercisesQuery = db.firestore.exercises;

  if (titleStartsWith) {
    exercisesQuery = exercisesQuery
      .where('title', '>=', titleStartsWith)
      .where('title', '<=', `${titleStartsWith}\uf8ff`);
  }

  if (type) {
    exercisesQuery = exercisesQuery.where('type', '==', type);
  }

  if (level) {
    exercisesQuery = exercisesQuery.where('level', '==', level);
  }

  if (gender) {
    exercisesQuery = exercisesQuery.where('gender', '==', gender);
  }

  exercisesQuery = exercisesQuery.orderBy('title', 'asc');

  if (offset) {
    const tmpExercisesSnapshot = await exercisesQuery.limit(offset).get();
    const tmpExercises = tmpExercisesSnapshot.docs;

    const startAfterPoint = tmpExercises[offset - 1];

    if (startAfterPoint) {
      exercisesQuery = exercisesQuery.startAfter(startAfterPoint);
    } else {
      exercisesQuery = false;
    }
  }

  if (limit) {
    exercisesQuery = exercisesQuery ? exercisesQuery.limit(limit) : false;
  }

  const exercises = [];

  if (exercisesQuery) {
    const exercisesSnapshot = await exercisesQuery.get();

    exercisesSnapshot.forEach((exercise) => {
      exercises.push({
        id: exercise.id,
        ...exercise.data(),
      });
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Exercises successfully retrieved.',
    exercises,
  });
}

module.exports = [validate(validations), getAllController];
