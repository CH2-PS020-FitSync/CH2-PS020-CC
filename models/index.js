const { Sequelize } = require('sequelize');

const dbHost = process.env.DB_HOST;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbDialect = process.env.DB_DIALECT;

const options = {
  host: dbHost,
  dialect: dbDialect,
  dialectOptions: {
    typeCast: (field, next) => {
      if (field.type === 'DATETIME') {
        return field.string();
      }
      return next();
    },
  },
  timezone: '+07:00',
};

if (process.env.IS_LOCAL === 'false') {
  options.dialectOptions.socketPath = dbHost;
}

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, options);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require('./User')(sequelize);
db.otps = require('./OTP')(sequelize);
db.refreshTokens = require('./RefreshToken')(sequelize);
db.bmis = require('./BMI')(sequelize);
db.workouts = require('./Workout')(sequelize);

db.users.hasOne(db.otps, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.otps.belongsTo(db.users);

db.users.hasOne(db.refreshTokens, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.refreshTokens.belongsTo(db.users);

db.users.hasMany(db.bmis, {
  onDelete: 'RESTRICT',
  onUpdate: 'NO ACTION',
});
db.bmis.belongsTo(db.users);

db.users.hasMany(db.workouts, {
  onDelete: 'RESTRICT',
  onUpdate: 'NO ACTION',
});
db.workouts.belongsTo(db.users);

module.exports = db;
