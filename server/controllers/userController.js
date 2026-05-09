const User = require('../models/User');

const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.age = req.body.age || user.age;
            user.gender = req.body.gender || user.gender;
            user.height = req.body.height || user.height;
            user.weight = req.body.weight || user.weight;

            if (req.body.password) {
                const bcrypt = require('bcryptjs');
                const salt = await bcrypt.genSalt(12);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: require('../utils/generateToken')(updatedUser._id) // keep user logged in
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getUserProfile, updateUserProfile };
