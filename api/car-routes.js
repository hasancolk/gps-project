const express = require('express');
const {addLocation,
       searchCarForId,
       searchCarForTimeRange
      } = require('./carController');

const router = express.Router();

router.post('/car', addLocation);
router.get('/searchCarForId/:carId', searchCarForId);
router.post('/searchCarForTimeRange',searchCarForTimeRange);

module.exports = {
    routes: router
}