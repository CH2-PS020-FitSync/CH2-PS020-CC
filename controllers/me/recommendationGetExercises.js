const axios = require('axios').default;

const db = require('../../models');

async function recommendationGetExercises(req, res) {
  try {
    if (!req.user.birthDate) {
      throw new Error("User's birth date should be set.");
    } else if (!req.user.gender) {
      throw new Error("User's gender should be set.");
    } else if (!req.user.level) {
      throw new Error("User's level should be set.");
    } else if (!req.user.goalWeight) {
      throw new Error("User's goal weight should be set.");
    } else {
      const totalBMIs = await req.user.countBMIs();

      if (totalBMIs < 1) {
        throw new Error("User's height & weight should be set.");
      }
    }

    try {
      const response = await axios.post(
        `${process.env.ML_BASE_URL}/workout_prediction`,
        {
          UserId: req.user.id,
        }
      );

      const { data: exerciseIds } = response.data;

      const searchParameter = {
        q: '*',
        filter_by: `id:[${exerciseIds.join(',')}]`,
        pinned_hits: exerciseIds.reduce(
          (pinnedHits, exerciseId, index) =>
            `${pinnedHits}${exerciseId}:${index + 1}${
              index + 1 < exerciseIds.length ? ',' : ''
            }`,
          ''
        ),
      };
      const exercises = (
        await db.typesense.exercises.documents().search(searchParameter)
      ).hits.map((exerciseHits) => exerciseHits.document);

      return res.status(200).json({
        status: 'success',
        message: "User's exercises recommendation successfully retrieved.",
        exercises,
      });
    } catch (error) {
      return res.status(503).json({
        status: 'error',
        message: 'Failed to get recommendation.',
        error: `ML API Error: ${error.message}`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}

module.exports = recommendationGetExercises;
