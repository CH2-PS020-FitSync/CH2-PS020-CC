const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class BMI extends Model {}

  BMI.init(
    {
      height: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    { sequelize }
  );

  return BMI;
};
