const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  body('workouts').exists().withMessage('Workouts is required'),
  body('workouts.*.exerciseId')
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
  body('workouts.*.rating')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Rating should be an integer and in 1-10 range.')
    .toInt(),
  body('workouts.*.date')
    .optional()
    .isISO8601()
    .withMessage('Date should be in ISO 8601 format.'),
];

async function workoutsPostManyController(req, res) {
  const newWorkouts = await db.workouts.bulkCreate(
    req.matchedData.workouts.map((newWorkout) => {
      const { exerciseId: ExerciseId, rating, date } = newWorkout;

      return {
        ExerciseId,
        rating,
        date,
        UserId: req.user.id,
      };
    })
  );

  const filteredNewWorkouts = newWorkouts.map((newWorkout) => {
    const newWorkoutInJSON = newWorkout.toJSON();

    return {
      id: newWorkoutInJSON.id,
      exerciseId: newWorkoutInJSON.ExerciseId,
      rating: newWorkoutInJSON.rating,
      date: newWorkoutInJSON.date,
      createdAt: newWorkoutInJSON.createdAt,
      updatedAt: newWorkoutInJSON.updatedAt,
    };
  });

  return res.status(201).json({
    status: 'success',
    message: "User's workouts successfully added.",
    workouts: filteredNewWorkouts,
  });
}

module.exports = [validate(validations), workoutsPostManyController];
