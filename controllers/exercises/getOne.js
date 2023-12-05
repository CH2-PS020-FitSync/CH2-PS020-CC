const { param } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  param('id').custom(async (id, { req }) => {
    const exerciseSnapshot = await db.firestore.exercises.doc(id).get();

    if (!exerciseSnapshot.exists) {
      throw new Error('Exercise not found.');
    } else {
      req.exerciseSnapshot = exerciseSnapshot;
      return true;
    }
  }),
];

async function getOneController(req, res) {
  return res.status(200).json({
    status: 'success',
    message: 'Exercise successfully retrieved.',
    exercise: {
      id: req.exerciseSnapshot.id,
      ...req.exerciseSnapshot.data(),
    },
  });
}

module.exports = [validate(validations), getOneController];
