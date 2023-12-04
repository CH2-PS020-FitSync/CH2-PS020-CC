const { body } = require('express-validator');

const validate = require('../../middlewares/validate');

const validations = [
  body('exerciseId').exists().withMessage('Exercise id is required.'),
];

async function workoutsAddController(req, res) {
  const newWorkout = await req.user.createWorkout({
    ExerciseId: req.matchedData.exerciseId,
  });

  return res.status(201).json({
    status: 'success',
    message: 'Workout successfully added.',
    data: {
      user: {
        id: req.user.id,
      },
      workout: {
        id: newWorkout.id,
        exerciseId: newWorkout.ExerciseId,
        createdAt: newWorkout.createdAt,
        updatedAt: newWorkout.updatedAt,
      },
    },
  });
}

module.exports = [validate(validations), workoutsAddController];
