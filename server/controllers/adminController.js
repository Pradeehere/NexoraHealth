const User = require('../models/User');
const HealthRecord = require('../models/HealthRecord');
const Goal = require('../models/Goal');

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.status(200).json({ message: 'User removed' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

const getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRecords = await HealthRecord.countDocuments();
        const activeToday = await HealthRecord.countDocuments({
            date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        });
        const goalsCreated = await Goal.countDocuments();

        res.status(200).json({
            totalUsers,
            totalRecords,
            activeToday,
            goalsCreated
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUsers, deleteUser, getStats };
