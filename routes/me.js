const express = require('express');

const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

const getController = require('../controllers/me/get');
const patchController = require('../controllers/me/patch');
const bmisGetAllController = require('../controllers/me/bmisGetAll');
const bmisGetOneController = require('../controllers/me/bmisGetOne');
const bmisAddController = require('../controllers/me/bmisAdd');
const photoAddController = require('../controllers/me/photoAdd');
const workoutsGetAllController = require('../controllers/me/workoutsGetAll');
const workoutsGetOneController = require('../controllers/me/workoutsGetOne');
const workoutsAddController = require('../controllers/me/workoutsAdd');

router.use(checkAuth);

router.get('/', getController);
router.patch('/', patchController);
router.get('/bmis', bmisGetAllController);
router.get('/bmis/:id', bmisGetOneController);
router.post('/bmis', bmisAddController);
router.put('/photo', photoAddController);
router.get('/workouts', workoutsGetAllController);
router.get('/workouts/:id', workoutsGetOneController);
router.post('/workouts', workoutsAddController);

module.exports = router;
