const Exercise = require('../models/Exercise');

// @desc    Get all exercises for user
// @route   GET /api/exercises
// @access  Private
const getExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new exercise
// @route   POST /api/exercises
// @access  Private
const addExercise = async (req, res) => {
    try {
        const { date, type, name, duration, caloriesBurned, intensity, notes } = req.body;

        const exercise = await Exercise.create({
            userId: req.user.id,
            date,
            type,
            name,
            duration,
            caloriesBurned,
            intensity,
            notes
        });

        res.status(201).json(exercise);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update exercise
// @route   PUT /api/exercises/:id
// @access  Private
const updateExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);

        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        if (exercise.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedExercise = await Exercise.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedExercise);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete exercise
// @route   DELETE /api/exercises/:id
// @access  Private
const deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);

        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        if (exercise.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await exercise.deleteOne();
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getExercises,
    addExercise,
    updateExercise,
    deleteExercise
};
