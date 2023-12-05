/* eslint-disable import/no-unresolved */
const {
  initializeApp,
  applicationDefault,
  cert,
} = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

module.exports = () => {
  let credential;

  if (process.env.IS_LOCAL === 'true') {
    // eslint-disable-next-line global-require
    const serviceAccount = require('../keys/firebase-adminsdk.json');
    credential = cert(serviceAccount);
  } else {
    credential = applicationDefault();
  }

  initializeApp({
    credential,
  });

  const db = getFirestore();

  return db;
};