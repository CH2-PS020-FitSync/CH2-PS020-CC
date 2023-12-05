const express = require('express');

const router = express.Router();

const getAllController = require('../controllers/exercises/getAll');
const getOneController = require('../controllers/exercises/getOne');

router.get('/', getAllController);
router.get('/:id', getOneController);

module.exports = router;
