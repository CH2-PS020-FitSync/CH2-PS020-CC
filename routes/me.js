const express = require('express');

const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

const getController = require('../controllers/me/get');
const patchController = require('../controllers/me/patch');
const bmisGetAllController = require('../controllers/me/bmisGetAll');
const bmisGetOneController = require('../controllers/me/bmisGetOne');
const bmisAddOneController = require('../controllers/me/bmisAddOne');
const bmisAddManyController = require('../controllers/me/bmisAddMany');
const photoPutController = require('../controllers/me/photoPut');
const workoutsGetAllController = require('../controllers/me/workoutsGetAll');
const workoutsGetOneController = require('../controllers/me/workoutsGetOne');
const workoutsAddOneController = require('../controllers/me/workoutsAddOne');
const workoutsAddManyController = require('../controllers/me/workoutsAddMany');

router.use(checkAuth);

router.get('/', getController);
router.patch('/', patchController);
router.get('/bmis', bmisGetAllController);
router.get('/bmis/:id', bmisGetOneController);
router.post('/bmis', bmisAddOneController);
router.post('/bmis/many', bmisAddManyController);
router.put('/photo', photoPutController);
router.get('/workouts', workoutsGetAllController);
router.get('/workouts/:id', workoutsGetOneController);
router.post('/workouts', workoutsAddOneController);
router.post('/workouts/many', workoutsAddManyController);

module.exports = router;
