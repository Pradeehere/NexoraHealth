const express = require('express');
const router = express.Router();
const { getExercises, addExercise, updateExercise, deleteExercise } = require('../controllers/exerciseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getExercises);
router.post('/', addExercise);
router.put('/:id', updateExercise);
router.delete('/:id', deleteExercise);

module.exports = router;
