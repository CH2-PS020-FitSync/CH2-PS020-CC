const { Sequelize } = require('sequelize');

const dbHost = process.env.DB_HOST;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbDialect = process.env.DB_DIALECT;

const dbOptions = {
  host: dbHost,
  dialect: dbDialect,
  dialectOptions: {},
};

if (process.env.IS_LOCAL.toLowerCase() === 'false') {
  dbOptions.dialectOptions.socketPath = dbHost;
}

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, dbOptions);

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

const rawExercises = require('../assets/exercises.json');

const typesenseClient = require('./typesense');
const exercisesSchema = require('./TypesenseExercise');

db.firestore = require('./firestore')();

db.firestore.exercises = db.firestore.collection('exercises');
db.firestore.typesenseSync = db.firestore.collection('typesense_sync');

db.typesense = {};
db.typesense.client = typesenseClient;

const typesenseSchemas = [exercisesSchema];

db.typesense.init = async () => {
  try {
    const exercisesSize = (await db.firestore.exercises.get()).size;
    const typesenseSyncSize = (await db.firestore.typesenseSync.get()).size;

    if (exercisesSize < 1) {
      for (const exercise of rawExercises) {
        await db.firestore.exercises.add(exercise);
      }
    }

    if (typesenseSyncSize < 1) {
      await db.firestore.typesenseSync.doc('backfill').set({
        trigger: true,
      });
    }

    const collections = await typesenseClient.collections().retrieve();

    for (const schema of typesenseSchemas) {
      const schemaAliasName = schema.name.split('_')[0];
      let isNeedUpsert = true;
      let oldCollectionName = null;

      for (const collection of collections) {
        const collectionAliasName = collection.name.split('_')[0];

        if (collectionAliasName === schemaAliasName) {
          if (collection.name !== schema.name) {
            oldCollectionName = collection.name;
          } else {
            isNeedUpsert = false;
          }

          break;
        }
      }

      if (isNeedUpsert) {
        if (oldCollectionName) {
          await typesenseClient.collections(oldCollectionName).delete();
        }

        await typesenseClient.collections().create(schema);

        await typesenseClient
          .aliases()
          .upsert(schemaAliasName, { collection_name: schema.name });

        await db.firestore.typesenseSync
          .doc('backfill')
          .update({ trigger: false });

        await db.firestore.typesenseSync
          .doc('backfill')
          .update({ trigger: true });
      }

      db.typesense[schemaAliasName] =
        typesenseClient.collections(schemaAliasName);
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = db;
