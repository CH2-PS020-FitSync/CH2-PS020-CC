const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Workout extends Model {}

  Workout.init(
    {
      ExerciseId: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    { sequelize }
  );

  return Workout;
};
