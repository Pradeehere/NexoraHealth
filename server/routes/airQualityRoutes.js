const express = require('express');
const router = express.Router();
const { getAirQuality } = require('../controllers/airQualityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAirQuality);

module.exports = router;
