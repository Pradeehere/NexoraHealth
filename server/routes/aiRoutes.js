const express = require('express');
const router = express.Router();
const { getAiSuggestions, getHealthScore, generateMealPlan, generateWorkoutPlan } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/suggestions', protect, getAiSuggestions);
router.get('/health-score', protect, getHealthScore);
router.post('/meal-plan', protect, generateMealPlan);
router.post('/workout-plan', protect, generateWorkoutPlan);


module.exports = router;

