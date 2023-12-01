const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class OTP extends Model {}

  OTP.init(
    {
      code: {
        type: DataTypes.STRING(72),
        allowNull: false,
      },
    },
    { sequelize }
  );

  return OTP;
};
