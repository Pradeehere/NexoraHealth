const User = require('../models/User');
const HealthRecord = require('../models/HealthRecord');

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

const getStreak = async (req, res) => {
  try {
    const userId = req.user._id;
    const records = await HealthRecord.find({ userId })
      .sort({ date: -1 })
      .select('date');

    if (!records.length) {
      return res.status(200).json({ streak: 0, longestStreak: 0, message: 'Start logging to build your streak!', isOnFire: false });
    }

    // Calculate consecutive days streak
    let streak = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0,0,0,0);

    // Get unique dates
    const uniqueDates = [...new Set(records.map(r => {
      const d = new Date(r.date);
      d.setHours(0,0,0,0);
      return d.getTime();
    }))].sort((a, b) => b - a);

    const ONE_DAY = 86400000;
    const todayTime = today.getTime();
    const yesterdayTime = todayTime - ONE_DAY;

    // Check if user logged today or yesterday (streak still alive)
    if (uniqueDates[0] !== todayTime && uniqueDates[0] !== yesterdayTime) {
      return res.status(200).json({
        streak: 0, longestStreak: 0,
        message: 'Your streak was broken. Start fresh today!',
        isOnFire: false, lastLogged: new Date(uniqueDates[0])
      });
    }

    // Count streak
    let expected = uniqueDates[0];
    for (const date of uniqueDates) {
      if (date === expected) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
        expected -= ONE_DAY;
      } else break;
    }
    streak = currentStreak;

    // AI motivational message based on streak
    const messages = {
      0: 'Every expert was once a beginner. Log today to start your streak!',
      1: 'Day 1 complete! The journey of a thousand miles begins with a single step.',
      2: 'Two days strong! Consistency is the key to transformation.',
      3: 'Three days in a row! You are building an unstoppable habit.',
      5: 'Five day streak! Your dedication is already showing results.',
      7: '🔥 One full week! You are in the top 20% of health trackers.',
      10: '🔥 10 days! Your body is thanking you for this consistency.',
      14: '🔥 Two weeks strong! Habits take 21 days — you are almost there.',
      21: '🏆 21 days! Science says this is now a habit. You did it.',
      30: '🏆 30 DAY STREAK! You are an elite health tracker. Incredible.',
      50: '👑 50 days. You are an inspiration. Keep going.',
      100: '👑 100 DAYS. Legendary status achieved. You are unstoppable.'
    };

    const milestones = [100, 50, 30, 21, 14, 10, 7, 5, 3, 2, 1, 0];
    const milestone = milestones.find(m => streak >= m);
    const message = messages[milestone] || `${streak} day streak! Keep going strong.`;

    return res.status(200).json({
      streak,
      longestStreak,
      message,
      isOnFire: streak >= 7,
      milestone: streak >= 7 ? `${streak} Day Streak` : null
    });
  } catch (e) {
    return res.status(200).json({ streak: 0, longestStreak: 0, message: 'Keep logging daily!', isOnFire: false });
  }
};

module.exports = { getUserProfile, updateUserProfile, getStreak };

