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
  body('workouts.*.date')
    .optional()
    .isISO8601()
    .withMessage('Date should be in ISO 8601 format.'),
];

async function workoutsAddManyController(req, res) {
  const newWorkouts = await db.workouts.bulkCreate(
    req.matchedData.workouts.map((newWorkout) => ({
      ExerciseId: newWorkout.exerciseId,
      date: newWorkout.date,
      UserId: req.user.id,
    }))
  );

  const filteredNewWorkouts = newWorkouts.map((newWorkout) => {
    const newWorkoutInJSON = newWorkout.toJSON();

    return {
      id: newWorkoutInJSON.id,
      exerciseId: newWorkoutInJSON.ExerciseId,
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

module.exports = [validate(validations), workoutsAddManyController];
