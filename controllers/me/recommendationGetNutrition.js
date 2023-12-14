const axios = require('axios').default;

async function recommendationGetNutrition(req, res) {
  try {
    const response = await axios.post(
      `${process.env.ML_BASE_URL}/nutrition_prediction`,
      {
        UserId: req.user.id,
      }
    );

    const { data: resNutrition } = response.data;

    const nutrition = {
      estimatedCalories: parseFloat(resNutrition.Estimated_Calories),
      estimatedCarbohydrates: parseFloat(resNutrition.Estimated_Carbohydrates),
      estimatedFat: parseFloat(resNutrition.Estimated_Fat),
      estimatedProteinMean: parseFloat(resNutrition.Estimated_Protein_Mean),
    };

    return res.status(200).json({
      status: 'success',
      message: "User's nutrition recommendation successfully retrieved.",
      nutrition,
    });
  } catch (error) {
    return res.status(503).json({
      status: 'error',
      message: 'Failed to get recommendation.',
      error: `ML API Error: ${error.message}`,
    });
  }
}

module.exports = recommendationGetNutrition;
