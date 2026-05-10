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

        // Generate 14 days of historical data for the charts
        const healthRecords = [];
        for (let i = 0; i < 14; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            healthRecords.push({
                userId: pradeepUser._id,
                date: date,
                weight: 75 + (Math.random() * 0.5 - 0.25),
                calories: Math.floor(Math.random() * (2400 - 1900 + 1)) + 1900,
                waterIntake: Math.floor(Math.random() * (10 - 6 + 1)) + 6,
                sleepHours: Math.floor(Math.random() * (9 - 6 + 1)) + 6,
                mood: Math.floor(Math.random() * 5) + 1,
            });
        }
        await HealthRecord.insertMany(healthRecords);

        // Notifications
        await Notification.create({
            userId: pradeepUser._id,
            message: 'Welcome to Nexora Health! Your history has been initialized.',
            type: 'success'
        });

        console.log('Production Data Seeded Successful (14 Days of History)');
    } catch (error) {
        console.error('Seeding error:', error);
        throw error;
    }
};

module.exports = { importData };
