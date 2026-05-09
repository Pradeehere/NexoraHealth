const mongoose = require('mongoose');

const healthRecordSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        date: { type: Date, required: true, default: Date.now },
        weight: { type: Number }, // in kg
        calories: { type: Number, required: true },
        waterIntake: { type: Number, required: true }, // in glasses
        sleepHours: { type: Number, required: true },
        mood: { type: Number, min: 1, max: 5 }, // 1-5 scale
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
