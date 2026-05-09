const express = require('express');
const router = express.Router();
const { getAiSuggestions } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/suggestions', protect, getAiSuggestions);

module.exports = router;
