const { param } = require('express-validator');

const db = require('../../models');
const validate = require('../../middlewares/validate');

const validations = [
  param('id').custom(async (id, { req }) => {
    const exercise = await db.typesense.exercises.documents(id).retrieve();

    if (!exercise.id) {
      throw new Error('Exercise not found.');
    } else {
      req.exercise = exercise;
      return true;
    }
  }),
];

async function getOneController(req, res) {
  return res.status(200).json({
    status: 'success',
    message: 'Exercise successfully retrieved.',
    exercise: req.exercise,
  });
}

module.exports = [validate(validations), getOneController];
