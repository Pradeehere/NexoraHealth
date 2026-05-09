const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        date: { type: Date, required: true, default: Date.now },
        type: { type: String, enum: ['cardio', 'strength', 'yoga', 'other'], required: true },
        name: { type: String, required: true },
        duration: { type: Number, required: true }, // minutes
        caloriesBurned: { type: Number, required: true },
        intensity: { type: String, enum: ['low', 'medium', 'high'], required: true },
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
