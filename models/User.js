const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(72),
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female'),
      },
      birthDate: {
        type: DataTypes.DATEONLY(),
      },
      level: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'expert'),
      },
      goalWeight: {
        type: DataTypes.FLOAT,
      },
      photoUrl: {
        type: DataTypes.STRING(2048),
      },
    },
    { sequelize }
  );

  return User;
};
