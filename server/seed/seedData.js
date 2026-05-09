require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const HealthRecord = require('../models/HealthRecord');
const Exercise = require('../models/Exercise');
const Goal = require('../models/Goal');
const Notification = require('../models/Notification');
const connectDB = require('../config/db');

const importData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await HealthRecord.deleteMany();
        await Exercise.deleteMany();
        await Goal.deleteMany();
        await Notification.deleteMany();

        const salt = await bcrypt.genSalt(12);

        const adminUser = {
            name: "Nexora Admin",
            email: "admin@nexora.com",
            password: await bcrypt.hash("Admin@123", salt),
            role: "admin",
            age: 35,
            gender: "Male"
        };

        const stdUser = {
            name: "Arjun Sharma",
            email: "arjun@nexora.com",
            password: await bcrypt.hash("User@123", salt),
            role: "user",
            age: 28,
            gender: "Male",
            height: 175,
            weight: 72
        };

        const createdUsers = await User.insertMany([adminUser, stdUser]);
        const arjunUser = createdUsers[1];

        // Generate 14 health records for the last 14 days
        const healthRecords = [];
        for (let i = 0; i < 14; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            healthRecords.push({
                userId: arjunUser._id,
                date: date,
                weight: 72 + (Math.random() * 2 - 1),
                calories: Math.floor(Math.random() * (2500 - 1800 + 1)) + 1800,
                waterIntake: Math.floor(Math.random() * (10 - 6 + 1)) + 6,
                sleepHours: Math.floor(Math.random() * (9 - 5 + 1)) + 5,
                mood: Math.floor(Math.random() * 5) + 1,
            });
        }
        await HealthRecord.insertMany(healthRecords);

        // Generate 7 exercises
        const exercises = [
            { userId: arjunUser._id, type: 'cardio', name: 'Morning Run', duration: 30, caloriesBurned: 300, intensity: 'medium' },
            { userId: arjunUser._id, type: 'strength', name: 'Weight Lifting', duration: 45, caloriesBurned: 400, intensity: 'high' },
            { userId: arjunUser._id, type: 'yoga', name: 'Hatha Yoga', duration: 60, caloriesBurned: 200, intensity: 'low' },
            { userId: arjunUser._id, type: 'cardio', name: 'Cycling', duration: 40, caloriesBurned: 350, intensity: 'medium' },
            { userId: arjunUser._id, type: 'strength', name: 'Leg Day', duration: 50, caloriesBurned: 450, intensity: 'high' },
            { userId: arjunUser._id, type: 'other', name: 'Walking', duration: 30, caloriesBurned: 150, intensity: 'low' },
            { userId: arjunUser._id, type: 'cardio', name: 'HIIT', duration: 20, caloriesBurned: 400, intensity: 'high' }
        ];
        await Exercise.insertMany(exercises);

        // Generate 4 goals
        const goals = [
            { userId: arjunUser._id, type: 'weight', targetValue: 68, currentValue: 72, unit: 'kg', deadline: new Date(new Date().setMonth(new Date().getMonth() + 2)) },
            { userId: arjunUser._id, type: 'water', targetValue: 8, currentValue: 6, unit: 'glasses', deadline: new Date() },
            { userId: arjunUser._id, type: 'sleep', targetValue: 8, currentValue: 6, unit: 'hours', deadline: new Date() },
            { userId: arjunUser._id, type: 'calories', targetValue: 500, currentValue: 200, unit: 'kcal/day', deadline: new Date() }
        ];
        await Goal.insertMany(goals);

        // Notifications
        const notifications = [
            { userId: arjunUser._id, message: 'Welcome to Nexora Health! Track, Analyze, and Thrive.', type: 'success' },
            { userId: arjunUser._id, message: 'You are 2 glasses away from your water goal today.', type: 'info' },
            { userId: arjunUser._id, message: 'Your weekly wellness summary is ready.', type: 'info' }
        ];
        await Notification.insertMany(notifications);

        console.log('Data Imported successfully');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
