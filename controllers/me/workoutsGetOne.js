const { param, query } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  param('id').custom(async (id, { req }) => {
    const workout = await db.workouts.findByPk(id, {
      attributes: [
        'id',
        ['ExerciseId', 'exerciseId'],
        'rating',
        'date',
        'createdAt',
        'updatedAt',
        'UserId',
      ],
    });

    if (!workout) {
      throw new Error('Workout not found.');
    } else {
      req.workout = workout;
      return true;
    }
  }),
  query('detail')
    .optional()
    .isBoolean()
    .withMessage('Detail should be boolean [true, false, 0, 1].')
    .toBoolean(true),
];

async function workoutsGetOneController(req, res) {
  const user = await req.workout.getUser();

  if (user.id !== req.user.id) {
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden.',
    });
  }

  const { UserId, ...filteredWorkout } = req.workout.toJSON();

  const workout = filteredWorkout;

  if (req.matchedData.detail) {
    workout.exercise = await db.typesense.exercises
      .documents(workout.exerciseId)
      .retrieve();

    delete workout.exerciseId;
  }

  return res.status(200).json({
    status: 'success',
    message: "User's workout successfully retrieved.",
    workout,
  });
}

module.exports = [validate(validations), workoutsGetOneController];
