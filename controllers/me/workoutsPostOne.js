const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  body('exerciseId')
    .exists()
    .withMessage("Exercise's id is required.")
    .custom(async (exerciseId) => {
      try {
        const exercise = await db.typesense.exercises
          .documents(exerciseId)
          .retrieve();

        if (!exercise.id) {
          throw new Error('Exercise not found.');
        } else {
          return true;
        }
      } catch (error) {
        throw new Error('Exercise not found.');
      }
    }),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Rating should be an integer and in 1-10 range.')
    .toInt(),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date should be in ISO 8601 format.'),
];

async function workoutsPostOneController(req, res) {
  const { exerciseId: ExerciseId, rating, date } = req.matchedData;

  const createdWorkout = await req.user.createWorkout({
    ExerciseId,
    rating,
    date,
  });
  const newWorkout = await db.workouts.findByPk(createdWorkout.id);

  return res.status(201).json({
    status: 'success',
    message: "User's workout successfully added.",
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

module.exports = [validate(validations), workoutsPostOneController];
