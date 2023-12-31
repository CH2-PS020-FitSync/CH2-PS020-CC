const express = require('express');

const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

const getController = require('../controllers/me/get');
const patchController = require('../controllers/me/patch');
const photoPutController = require('../controllers/me/photoPut');
const bmisGetAllController = require('../controllers/me/bmisGetAll');
const bmisGetOneController = require('../controllers/me/bmisGetOne');
const bmisPutOneController = require('../controllers/me/bmisPutOne');
const bmisPutManyController = require('../controllers/me/bmisPutMany');
const workoutsGetAllController = require('../controllers/me/workoutsGetAll');
const workoutsGetOneController = require('../controllers/me/workoutsGetOne');
const workoutsPostOneController = require('../controllers/me/workoutsPostOne');
const workoutsPostManyController = require('../controllers/me/workoutsPostMany');
const recommendationGetExercises = require('../controllers/me/recommendationGetExercises');
const recommendationGetNutrition = require('../controllers/me/recommendationGetNutrition');

router.use(checkAuth);

router.get('/', getController);
router.patch('/', patchController);
router.put('/photo', photoPutController);
router.get('/bmis', bmisGetAllController);
router.get('/bmis/:id', bmisGetOneController);
router.put('/bmis', bmisPutOneController);
router.put('/bmis/many', bmisPutManyController);
router.get('/workouts', workoutsGetAllController);
router.get('/workouts/:id', workoutsGetOneController);
router.post('/workouts', workoutsPostOneController);
router.post('/workouts/many', workoutsPostManyController);
router.get('/recommendation/exercises', recommendationGetExercises);
router.get('/recommendation/nutrition', recommendationGetNutrition);

module.exports = router;
