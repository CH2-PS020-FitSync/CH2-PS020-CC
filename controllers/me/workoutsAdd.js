const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  body('exerciseId')
    .exists()
    .withMessage('Exercise id is required.')
    .custom(async (exerciseId) => {
      const exerciseSnapshot = await db.firestore.exercises
        .doc(exerciseId)
        .get();

      if (!exerciseSnapshot.exists) {
        throw new Error('Exercise not found.');
      } else {
        return true;
      }
    }),
];

async function workoutsAddController(req, res) {
  const newWorkout = await req.user.createWorkout({
    ExerciseId: req.matchedData.exerciseId,
  });

  return res.status(201).json({
    status: 'success',
    message: 'Workout successfully added.',
    workout: {
      id: newWorkout.id,
      exerciseId: newWorkout.ExerciseId,
      createdAt: newWorkout.createdAt,
      updatedAt: newWorkout.updatedAt,
    },
  });
}

module.exports = [validate(validations), workoutsAddController];
