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
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date should be in ISO 8601 format.'),
];

async function workoutsAddOneController(req, res) {
  const newWorkout = await req.user.createWorkout({
    ExerciseId: req.matchedData.exerciseId,
    date: req.matchedData.date,
  });

  return res.status(201).json({
    status: 'success',
    message: 'Workout successfully added.',
    workout: {
      id: newWorkout.id,
      exerciseId: newWorkout.ExerciseId,
      date: newWorkout.date,
      createdAt: newWorkout.createdAt,
      updatedAt: newWorkout.updatedAt,
    },
  });
}

module.exports = [validate(validations), workoutsAddOneController];
