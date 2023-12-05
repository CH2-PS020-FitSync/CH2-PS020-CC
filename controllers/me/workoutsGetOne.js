const { param } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  param('id').custom(async (id, { req }) => {
    const workout = await db.workouts.findByPk(id);

    if (!workout) {
      throw new Error('Workout not found.');
    } else {
      req.workout = workout;
      return true;
    }
  }),
];

async function workoutsGetOneController(req, res) {
  const user = await req.workout.getUser();

  if (user.id !== req.user.id) {
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden.',
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Workout successfully retrieved.',
    workout: {
      id: req.workout.id,
      exerciseId: req.workout.ExerciseId,
      date: req.workout.date,
      createdAt: req.workout.createdAt,
      updatedAt: req.workout.updatedAt,
    },
  });
}

module.exports = [validate(validations), workoutsGetOneController];
