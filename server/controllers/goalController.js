const Goal = require('../models/Goal');

const getGoals = async (req, res, next) => {
    try {
        const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(goals);
    } catch (error) {
        next(error);
    }
};

const addGoal = async (req, res, next) => {
    try {
        const goal = await Goal.create({
            ...req.body,
            userId: req.user._id,
        });
        res.status(201).json(goal);
    } catch (error) {
        next(error);
    }
};

const updateGoal = async (req, res, next) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            res.status(404);
            throw new Error('Goal not found');
        }
        if (goal.userId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updatedGoal = await Goal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedGoal);
    } catch (error) {
        next(error);
    }
};

const deleteGoal = async (req, res, next) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            res.status(404);
            throw new Error('Goal not found');
        }
        if (goal.userId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await goal.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = { getGoals, addGoal, updateGoal, deleteGoal };
