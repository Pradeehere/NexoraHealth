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
        const record = await HealthRecord.create({
            ...req.body,
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

        const updatedRecord = await HealthRecord.findByIdAndUpdate(
            req.params.id,
            req.body,
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
