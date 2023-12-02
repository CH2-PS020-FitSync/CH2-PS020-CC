const { body } = require('express-validator');

const validate = require('../../middlewares/validate');

const validations = [
  body('exerciseId')
    .exists()
    .withMessage('Exercise id is required.')
    .isLength({ min: 20, max: 20 })
    .withMessage('Exercise id should be 20 characters.'),
];

async function workoutsAddController(req, res) {
  const newWorkout = await req.user.createWorkout({
    ExerciseId: req.matchedData.exerciseId,
  });
  const {
    id,
    ExerciseId: exerciseId,
    updatedAt,
    createdAt,
  } = newWorkout.toJSON();

  return res.status(201).json({
    status: 'success',
    message: 'Workout successfully added.',
    data: {
      user: {
        id: req.user.id,
      },
      workout: {
        id,
        exerciseId,
        updatedAt,
        createdAt,
      },
    },
  });
}

module.exports = [validate(validations), workoutsAddController];
