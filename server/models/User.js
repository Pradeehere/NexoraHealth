const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        age: { type: Number },
        gender: { type: String },
        height: { type: Number }, // in cm
        weight: { type: Number }, // in kg
        profilePicture: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
