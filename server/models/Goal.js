const mongoose = require('mongoose');

const goalSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        type: { type: String, enum: ['weight', 'calories', 'water', 'sleep', 'exercise'], required: true },
        targetValue: { type: Number, required: true },
        currentValue: { type: Number, default: 0 },
        unit: { type: String, required: true },
        deadline: { type: Date, required: true },
        isAchieved: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Goal', goalSchema);
