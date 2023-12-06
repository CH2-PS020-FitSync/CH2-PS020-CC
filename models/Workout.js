const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Workout extends Model {}

  Workout.init(
    {
      ExerciseId: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER(10),
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    { sequelize }
  );

  return Workout;
};
