const express = require('express');

const placesControllers = require('../controllers/places-controllers')

const router = express.Router();



router.get('/:pid', placesControllers.getPlaceBypid);

router.get('/user/:uid', placesControllers.getPlacesByuid);


module.exports = router;