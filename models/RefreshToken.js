const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class RefreshToken extends Model {}

  RefreshToken.init(
    {
      token: {
        type: DataTypes.STRING(512),
        unique: true,
        allowNull: false,
      },
    },
    { sequelize }
  );

  return RefreshToken;
};
