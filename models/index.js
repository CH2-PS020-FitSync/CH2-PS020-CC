const { Sequelize } = require('sequelize');

const dbHost = process.env.DB_HOST;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbDialect = process.env.DB_DIALECT;

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require('./User')(sequelize);
db.otps = require('./OTP')(sequelize);
db.refreshTokens = require('./RefreshToken')(sequelize);
db.bmis = require('./BMI')(sequelize);

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

module.exports = db;
