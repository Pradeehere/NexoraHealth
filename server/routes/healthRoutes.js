const express = require('express');
const router = express.Router();
const { getHealthRecords, addHealthRecord, updateHealthRecord, deleteHealthRecord, getWeeklyStats, getMonthlyStats } = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validationMiddleware');

router.use(protect);

router.get('/', getHealthRecords);
router.post('/', [
    body('calories').isNumeric().withMessage('Calories must be a number'),
    body('waterIntake').isNumeric().withMessage('Water Intake must be a number'),
    body('sleepHours').isNumeric().withMessage('Sleep Hours must be a number'),
    validateRequest
], addHealthRecord);

router.put('/:id', updateHealthRecord);
router.delete('/:id', deleteHealthRecord);

router.get('/stats/weekly', getWeeklyStats);
router.get('/stats/monthly', getMonthlyStats);

module.exports = router;
