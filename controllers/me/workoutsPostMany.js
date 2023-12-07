const { body } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  body('workouts').exists().withMessage('Workouts is required'),
  body('workouts.*.exerciseId')
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
  body('workouts.*.rating')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Rating should be in 1-10 range.')
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
    message: 'Workouts successfully added.',
    workouts: filteredNewWorkouts,
  });
}

module.exports = [validate(validations), workoutsPostManyController];
