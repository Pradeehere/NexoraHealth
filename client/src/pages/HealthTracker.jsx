import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const HealthTracker = () => {
    const { user } = useSelector(state => state.auth);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { register: registerHealth, handleSubmit: handleHealthSubmit, reset: resetHealth } = useForm();
    const { register: registerExercise, handleSubmit: handleExerciseSubmit, reset: resetExercise } = useForm();

    const fetchRecords = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('/api/health', config);
            setRecords(res.data);
            setIsLoading(false);
        } catch (error) {
            toast.error('Failed to load health records');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [user]);

    const onHealthSubmit = async (data) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.post('/api/health', data, config);
            setRecords([res.data, ...records]);
            resetHealth();
            toast.success('Health entry added!');
        } catch (error) {
            toast.error('Error adding health log');
        }
    };

    const onDeleteRecord = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/health/${id}`, config);
            setRecords(records.filter(r => r._id !== id));
            toast.success('Record deleted');
        } catch (err) {
            toast.error('Could not delete');
        }
    };

    if (isLoading) return <LoadingSkeleton count={3} className="h-64" />;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-3xl font-heading font-bold mb-6">Health Tracker</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Forms */}
                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                            <PlusCircle className="text-brand-cyan" /> Add Daily Health Log
                        </h3>
                        <form onSubmit={handleHealthSubmit(onHealthSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-brand-muted mb-1">Weight (kg)</label>
                                    <input type="number" step="0.1" {...registerHealth('weight')} className="w-full bg-brand-dark/50 border border-brand-card rounded-lg p-2 focus:border-brand-cyan outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-brand-muted mb-1">Calories Consumed</label>
                                    <input type="number" {...registerHealth('calories', { required: true })} className="w-full bg-brand-dark/50 border border-brand-card rounded-lg p-2 focus:border-brand-cyan outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-brand-muted mb-1">Water Intakes (glasses)</label>
                                    <input type="number" {...registerHealth('waterIntake', { required: true })} className="w-full bg-brand-dark/50 border border-brand-card rounded-lg p-2 focus:border-brand-cyan outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-brand-muted mb-1">Sleep Hours</label>
                                    <input type="number" step="0.1" {...registerHealth('sleepHours', { required: true })} className="w-full bg-brand-dark/50 border border-brand-card rounded-lg p-2 focus:border-brand-cyan outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-brand-muted mb-1 flex justify-between">
                                    <span>Mood (1-5)</span>
                                </label>
                                <input type="range" min="1" max="5" {...registerHealth('mood')} className="w-full accent-brand-cyan" />
                            </div>
                            <button type="submit" className="w-full bg-brand-card border border-brand-cyan text-brand-cyan py-2 rounded hover:bg-brand-cyan hover:text-brand-dark transition-colors font-bold">
                                Log Health Info
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Today's Logs */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-heading font-bold mb-4">Recent Entries</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-brand-card text-brand-muted text-sm">
                                    <th className="pb-2">Date</th>
                                    <th className="pb-2">Calories</th>
                                    <th className="pb-2">Water</th>
                                    <th className="pb-2">Sleep</th>
                                    <th className="pb-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.slice(0, 7).map(record => (
                                    <tr key={record._id} className="border-b border-brand-card/50">
                                        <td className="py-3">{new Date(record.date).toLocaleDateString()}</td>
                                        <td>{record.calories}</td>
                                        <td>{record.waterIntake}</td>
                                        <td>{record.sleepHours}</td>
                                        <td>
                                            <button onClick={() => onDeleteRecord(record._id)} className="text-brand-danger hover:text-red-400 p-1 rounded hover:bg-red-400/10">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {records.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center text-brand-muted">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthTracker;
