const { param } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  param('id').custom(async (id) => {
    const workout = await db.workouts.findByPk(id);
    if (!workout) {
      throw new Error('Workout not found.');
    } else {
      return true;
    }
  }),
];

async function workoutsGetOneController(req, res) {
  const workout = await db.workouts.findByPk(req.matchedData.id);
  const user = await workout.getUser();

  if (user.id !== req.user.id) {
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden.',
    });
  }

  const {
    UserId,
    ExerciseId: exerciseId,
    ...filteredWorkout
  } = workout.toJSON();

  return res.status(200).json({
    status: 'success',
    message: 'Workout successfully retrieved.',
    data: {
      user: {
        id: user.id,
      },
      workout: {
        ...filteredWorkout,
        exerciseId,
      },
    },
  });
}

module.exports = [validate(validations), workoutsGetOneController];
