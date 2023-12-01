const express = require('express');

const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

const getMeController = require('../controllers/me/getMe');
const patchMeController = require('../controllers/me/patchMe');
const getBMIsController = require('../controllers/me/getBMIs');
const addBMIController = require('../controllers/me/addBMI');

router.use(checkAuth);

router.get('/', ...getMeController);
router.patch('/', ...patchMeController);
router.get('/bmis', ...getBMIsController);
router.post('/bmis', ...addBMIController);

module.exports = router;
