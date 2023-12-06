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
  body('rating')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Rating should be in 1-10 range.')
    .toInt(),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date should be in ISO 8601 format.'),
];

async function workoutsAddOneController(req, res) {
  const { exerciseId: ExerciseId, rating, date } = req.matchedData;

  const newWorkout = await req.user.createWorkout({
    ExerciseId,
    rating,
    date,
  });

  return res.status(201).json({
    status: 'success',
    message: 'Workout successfully added.',
    workout: {
      id: newWorkout.id,
      exerciseId: newWorkout.ExerciseId,
      rating: newWorkout.rating,
      date: newWorkout.date,
      createdAt: newWorkout.createdAt,
      updatedAt: newWorkout.updatedAt,
    },
  });
}

module.exports = [validate(validations), workoutsAddOneController];
