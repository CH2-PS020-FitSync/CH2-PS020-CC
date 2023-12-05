const { param } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  param('id').custom(async (id, { req }) => {
    const exercise = await db.firestore.exercises.doc(id).get();

    if (!exercise.exists) {
      throw new Error('Exercise not found.');
    } else {
      req.exercise = exercise;
      return true;
    }
  }),
];

async function getOneController(req, res) {
  const exerciseSnapshot = req.exercise;

  return res.status(200).json({
    status: 'success',
    message: 'Exercise successfully retrieved.',
    exercise: {
      id: exerciseSnapshot.id,
      ...exerciseSnapshot.data(),
    },
  });
}

module.exports = [validate(validations), getOneController];
