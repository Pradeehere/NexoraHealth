const HealthRecord = require('../models/HealthRecord');

const getHealthRecords = async (req, res, next) => {
    try {
        const records = await HealthRecord.find({ userId: req.user._id }).sort({ date: -1 });
        res.status(200).json(records);
    } catch (error) {
        next(error);
    }
};

const addHealthRecord = async (req, res, next) => {
    try {
        const calories = req.body.calories !== undefined ? Number(req.body.calories) : 0;
        const waterIntake = req.body.waterIntake !== undefined ? Number(req.body.waterIntake) : 0;
        const sleepHours = req.body.sleepHours !== undefined ? Number(req.body.sleepHours) : 0;
        const mood = req.body.mood !== undefined ? Number(req.body.mood) : 3;
        const weight = req.body.weight !== undefined ? Number(req.body.weight) : 0;
        const date = req.body.date || new Date();

        const record = await HealthRecord.create({
            calories,
            waterIntake,
            sleepHours,
            mood,
            weight,
            date,
            userId: req.user._id,
        });
        res.status(201).json(record);
    } catch (error) {
        next(error);
    }
};

const updateHealthRecord = async (req, res, next) => {
    try {
        const record = await HealthRecord.findById(req.params.id);
        if (!record) {
            res.status(404);
            throw new Error('Record not found');
        }
        if (record.userId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updateData = {};
        if (req.body.calories !== undefined) updateData.calories = Number(req.body.calories);
        if (req.body.waterIntake !== undefined) updateData.waterIntake = Number(req.body.waterIntake);
        if (req.body.sleepHours !== undefined) updateData.sleepHours = Number(req.body.sleepHours);
        if (req.body.mood !== undefined) updateData.mood = Number(req.body.mood);
        if (req.body.weight !== undefined) updateData.weight = Number(req.body.weight);
        if (req.body.date !== undefined) updateData.date = req.body.date;

        const updatedRecord = await HealthRecord.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.status(200).json(updatedRecord);
    } catch (error) {
        next(error);
    }
};


const deleteHealthRecord = async (req, res, next) => {
    try {
        const record = await HealthRecord.findById(req.params.id);
        if (!record) {
            res.status(404);
            throw new Error('Record not found');
        }
        if (record.userId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await record.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};

const getWeeklyStats = async (req, res, next) => {
    try {
        // Mock weekly stats for MVP or actually aggregate
        const records = await HealthRecord.find({
            userId: req.user._id,
            date: { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) }
        }).sort({ date: 1 });
        res.status(200).json(records);
    } catch (error) {
        next(error);
    }
};

const getMonthlyStats = async (req, res, next) => {
    try {
        const records = await HealthRecord.find({
            userId: req.user._id,
            date: { $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000) }
        }).sort({ date: 1 });
        res.status(200).json(records);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getHealthRecords,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    getWeeklyStats,
    getMonthlyStats
};
