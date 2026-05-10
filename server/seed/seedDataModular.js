const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const HealthRecord = require('../models/HealthRecord');
const Exercise = require('../models/Exercise');
const Goal = require('../models/Goal');
const Notification = require('../models/Notification');

const importData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await HealthRecord.deleteMany();
        await Exercise.deleteMany();
        await Goal.deleteMany();
        await Notification.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('User@789', salt);

        const pradeepUser = await User.create({
            name: "Pradeep S",
            email: "Pradeep@nexora.com",
            password: hashedPassword,
            role: "user",
            age: 20,
            gender: "male",
            height: 173,
            weight: 75
        });

        // Add some basic records so it's not empty
        await HealthRecord.create({
            userId: pradeepUser._id,
            date: new Date(),
            weight: 75,
            calories: 2100,
            waterIntake: 8,
            sleepHours: 7,
            mood: 4
        });

        console.log('Production Data Seeded Successful');
    } catch (error) {
        console.error('Seeding error:', error);
        throw error;
    }
};

module.exports = { importData };
