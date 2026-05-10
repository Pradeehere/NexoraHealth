import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash2, Edit2 } from 'lucide-react';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const HealthTracker = () => {
    const { user } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('DAILY LOG');
    const [records, setRecords] = useState({ health: [], exercise: [], goals: [] });
    const [isLoading, setIsLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);

    const healthForm = useForm();
    const exerciseForm = useForm();
    const goalForm = useForm();

    const fetchAllRecords = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Note: If some endpoints don't exist, we swallow the error for them
            const [healthRes, exerciseRes, goalsRes] = await Promise.allSettled([
                axios.get('/api/health', config),
                axios.get('/api/exercises', config), // assuming this endpoint exists
                axios.get('/api/goals', config)      // assuming this endpoint exists
            ]);

            setRecords({
                health: healthRes.status === 'fulfilled' ? healthRes.value.data : [],
                exercise: exerciseRes.status === 'fulfilled' ? exerciseRes.value.data : [],
                goals: goalsRes.status === 'fulfilled' ? goalsRes.value.data : []
            });
            setIsLoading(false);
        } catch (error) {
            toast.error('Failed to load tracking records');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllRecords();
        // eslint-disable-next-line
    }, [user]);

    // HEALTH SUBMIT
    const onHealthSubmit = async (data) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editingId) {
                await axios.put(`/api/health/${editingId}`, data, config);
                setRecords(prev => ({
                    ...prev,
                    health: prev.health.map(r => r._id === editingId ? { ...r, ...data } : r)
                }));
                toast.success('Health entry updated!');
            } else {
                const res = await axios.post('/api/health', data, config);
                setRecords(prev => ({ ...prev, health: [res.data, ...prev.health] }));
                toast.success('Health entry added!');
            }
            healthForm.reset();
            setEditingId(null);
        } catch (error) {
            toast.error('Error saving health log');
        }
    };

    const onDeleteHealth = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/health/${id}`, config);
            setRecords(prev => ({ ...prev, health: prev.health.filter(r => r._id !== id) }));
            toast.success('Record deleted');
        } catch (err) {
            toast.error('Could not delete');
        }
    };

    // EXERCISE SUBMIT
    const onExerciseSubmit = async (data) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editingId) {
                await axios.put(`/api/exercises/${editingId}`, data, config);
                setRecords(prev => ({
                    ...prev,
                    exercise: prev.exercise.map(r => r._id === editingId ? { ...r, ...data } : r)
                }));
                toast.success('Exercise updated!');
            } else {
                const res = await axios.post('/api/exercises', data, config);
                setRecords(prev => ({ ...prev, exercise: [res.data, ...prev.exercise] }));
                toast.success('Exercise added!');
            }
            exerciseForm.reset();
            setEditingId(null);
        } catch (error) {
            toast.error('Error saving exercise');
        }
    };

    const onDeleteExercise = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/exercises/${id}`, config);
            setRecords(prev => ({ ...prev, exercise: prev.exercise.filter(r => r._id !== id) }));
            toast.success('Exercise deleted');
        } catch (err) {
            toast.error('Could not delete');
        }
    };

    // GOAL SUBMIT
    const onGoalSubmit = async (data) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editingId) {
                await axios.put(`/api/goals/${editingId}`, data, config);
                setRecords(prev => ({
                    ...prev,
                    goals: prev.goals.map(r => r._id === editingId ? { ...r, ...data } : r)
                }));
                toast.success('Goal updated!');
            } else {
                const res = await axios.post('/api/goals', data, config);
                setRecords(prev => ({ ...prev, goals: [res.data, ...prev.goals] }));
                toast.success('Goal added!');
            }
            goalForm.reset();
            setEditingId(null);
        } catch (error) {
            toast.error('Error saving goal');
        }
    };

    const onDeleteGoal = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/goals/${id}`, config);
            setRecords(prev => ({ ...prev, goals: prev.goals.filter(r => r._id !== id) }));
            toast.success('Goal deleted');
        } catch (err) {
            toast.error('Could not delete');
        }
    };

    const handleEdit = (type, record) => {
        setEditingId(record._id);
        if (type === 'health') {
            healthForm.reset(record);
            setActiveTab('DAILY LOG');
        }
        if (type === 'exercise') {
            exerciseForm.reset(record);
            setActiveTab('EXERCISE');
        }
        if (type === 'goals') {
            goalForm.reset({
                ...record,
                deadline: record.deadline ? new Date(record.deadline).toISOString().split('T')[0] : ''
            });
            setActiveTab('GOALS');
        }
    };

    if (isLoading) return <LoadingSkeleton count={3} className="h-64" />;

    return (
        <div className="space-y-8 animate-fade-in-up pb-12">
            <header className="bg-white border-b border-black pb-4">
                <h1 className="text-4xl md:text-5xl font-cormorant italic font-bold text-black uppercase tracking-wide">
                    Health Tracker
                </h1>
            </header>

            {/* Tabs */}
            <div className="flex flex-wrap gap-8 border-b border-gray-200">
                {['DAILY LOG', 'EXERCISE', 'GOALS'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setEditingId(null); healthForm.reset(); exerciseForm.reset(); goalForm.reset(); }}
                        className={`pb-2 font-tenor uppercase tracking-[0.15em] text-sm transition-colors ${activeTab === tab ? 'text-black border-b-2 border-brand-gold' : 'text-gray-400 hover:text-black'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* -------------------- DAILY LOG TAB -------------------- */}
                {activeTab === 'DAILY LOG' && (
                    <>
                        <div className="space-y-6 bg-white border border-black p-8">
                            <h3 className="text-xl font-tenor uppercase tracking-[0.15em] mb-4 text-black">
                                {editingId ? 'Edit Log' : 'New Daily Log'}
                            </h3>
                            <form onSubmit={healthForm.handleSubmit(onHealthSubmit)} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Weight (kg)</label>
                                        <input type="number" step="0.1" {...healthForm.register('weight')} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Calories</label>
                                        <input type="number" {...healthForm.register('calories', { required: true })} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Water (glasses)</label>
                                        <input type="number" {...healthForm.register('waterIntake', { required: true })} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Sleep Hours</label>
                                        <input type="number" step="0.1" {...healthForm.register('sleepHours', { required: true })} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-black text-white font-tenor uppercase tracking-[0.15em] py-4 hover:bg-brand-gold transition-colors">
                                    {editingId ? 'Update Entry' : 'Save Entry'}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={() => { setEditingId(null); healthForm.reset(); }} className="w-full bg-transparent border border-black text-black font-tenor uppercase tracking-[0.15em] py-4 hover:bg-gray-100 transition-colors mt-2">
                                        Cancel Edit
                                    </button>
                                )}
                            </form>
                        </div>

                        <div className="bg-white border border-black p-8">
                            <h3 className="text-xl font-tenor uppercase tracking-[0.15em] mb-6 text-brand-gold">Recent Daily Logs</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-jost">
                                    <thead>
                                        <tr className="border-b border-black text-[#555] text-xs font-tenor uppercase tracking-widest">
                                            <th className="pb-4 font-normal">Date</th>
                                            <th className="pb-4 font-normal">Cal.</th>
                                            <th className="pb-4 font-normal">Water</th>
                                            <th className="pb-4 font-normal">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.health.slice(0, 10).map(record => (
                                            <tr key={record._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-4">{new Date(record.date).toLocaleDateString()}</td>
                                                <td>{record.calories}</td>
                                                <td>{record.waterIntake}</td>
                                                <td className="flex items-center gap-4 py-4">
                                                    <button onClick={() => handleEdit('health', record)} className="text-brand-gold hover:text-black transition-colors"><Edit2 size={16} /></button>
                                                    <button onClick={() => onDeleteHealth(record._id)} className="text-red-500 hover:text-black transition-colors"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {records.health.length === 0 && (
                                            <tr><td colSpan="4" className="py-8 text-center text-gray-400">No records found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* -------------------- EXERCISE TAB -------------------- */}
                {activeTab === 'EXERCISE' && (
                    <>
                        <div className="space-y-6 bg-white border border-black p-8">
                            <h3 className="text-xl font-tenor uppercase tracking-[0.15em] mb-4 text-black">
                                {editingId ? 'Edit Exercise' : 'Log Exercise'}
                            </h3>
                            <form onSubmit={exerciseForm.handleSubmit(onExerciseSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Exercise Name</label>
                                        <input type="text" {...exerciseForm.register('name', { required: true })} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Duration (mins)</label>
                                            <input type="number" {...exerciseForm.register('duration', { required: true })} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Calories Burned</label>
                                            <input type="number" {...exerciseForm.register('caloriesBurned', { required: true })} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Intensity</label>
                                        <select {...exerciseForm.register('intensity')} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors">
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Type</label>
                                        <select {...exerciseForm.register('type')} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors">
                                            <option value="cardio">Cardio</option>
                                            <option value="strength">Strength</option>
                                            <option value="yoga">Yoga</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-black text-white font-tenor uppercase tracking-[0.15em] py-4 hover:bg-brand-gold transition-colors">
                                    {editingId ? 'Update Exercise' : 'Save Exercise'}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={() => { setEditingId(null); exerciseForm.reset(); }} className="w-full bg-transparent border border-black text-black font-tenor uppercase tracking-[0.15em] py-4 hover:bg-gray-100 transition-colors mt-2">
                                        Cancel Edit
                                    </button>
                                )}
                            </form>
                        </div>

                        <div className="bg-white border border-black p-8">
                            <h3 className="text-xl font-tenor uppercase tracking-[0.15em] mb-6 text-brand-gold">Exercise History</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-jost">
                                    <thead>
                                        <tr className="border-b border-black text-[#555] text-xs font-tenor uppercase tracking-widest">
                                            <th className="pb-4 font-normal">Name</th>
                                            <th className="pb-4 font-normal">Dur.</th>
                                            <th className="pb-4 font-normal">Type</th>
                                            <th className="pb-4 font-normal">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.exercise.map(record => (
                                            <tr key={record._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 truncate max-w-[100px]">{record.name}</td>
                                                <td>{record.duration}m</td>
                                                <td className="capitalize">{record.type}</td>
                                                <td className="flex items-center gap-4 py-4">
                                                    <button onClick={() => handleEdit('exercise', record)} className="text-brand-gold hover:text-black transition-colors"><Edit2 size={16} /></button>
                                                    <button onClick={() => onDeleteExercise(record._id)} className="text-red-500 hover:text-black transition-colors"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {records.exercise.length === 0 && (
                                            <tr><td colSpan="4" className="py-8 text-center text-gray-400">No exercises found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* -------------------- GOALS TAB -------------------- */}
                {activeTab === 'GOALS' && (
                    <>
                        <div className="space-y-6 bg-white border border-black p-8">
                            <h3 className="text-xl font-tenor uppercase tracking-[0.15em] mb-4 text-black">
                                {editingId ? 'Edit Goal' : 'Set New Goal'}
                            </h3>
                            <form onSubmit={goalForm.handleSubmit(onGoalSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Goal Type</label>
                                        <select {...goalForm.register('type')} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors">
                                            <option value="weight">Weight</option>
                                            <option value="water">Water</option>
                                            <option value="sleep">Sleep</option>
                                            <option value="calories">Calories</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Target Value</label>
                                            <input type="number" step="0.1" {...goalForm.register('targetValue', { required: true })} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Current Value</label>
                                            <input type="number" step="0.1" {...goalForm.register('currentValue')} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Unit (e.g. kg, hours)</label>
                                            <input type="text" {...goalForm.register('unit')} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block font-tenor text-xs tracking-widest text-[#555] mb-2 uppercase">Deadline</label>
                                            <input type="date" {...goalForm.register('deadline')} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-black text-white font-tenor uppercase tracking-[0.15em] py-4 hover:bg-brand-gold transition-colors">
                                    {editingId ? 'Update Goal' : 'Save Goal'}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={() => { setEditingId(null); goalForm.reset(); }} className="w-full bg-transparent border border-black text-black font-tenor uppercase tracking-[0.15em] py-4 hover:bg-gray-100 transition-colors mt-2">
                                        Cancel Edit
                                    </button>
                                )}
                            </form>
                        </div>

                        <div className="bg-white border border-black p-8">
                            <h3 className="text-xl font-tenor uppercase tracking-[0.15em] mb-6 text-brand-gold">Active Goals</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-jost">
                                    <thead>
                                        <tr className="border-b border-black text-[#555] text-xs font-tenor uppercase tracking-widest">
                                            <th className="pb-4 font-normal">Type</th>
                                            <th className="pb-4 font-normal">Progress</th>
                                            <th className="pb-4 font-normal">Target</th>
                                            <th className="pb-4 font-normal">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.goals.map(record => (
                                            <tr key={record._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 capitalize">{record.type}</td>
                                                <td>{record.currentValue} {record.unit}</td>
                                                <td className="text-brand-gold font-bold">{record.targetValue} {record.unit}</td>
                                                <td className="flex items-center gap-4 py-4">
                                                    <button onClick={() => handleEdit('goals', record)} className="text-brand-gold hover:text-black transition-colors"><Edit2 size={16} /></button>
                                                    <button onClick={() => onDeleteGoal(record._id)} className="text-red-500 hover:text-black transition-colors"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {records.goals.length === 0 && (
                                            <tr><td colSpan="4" className="py-8 text-center text-gray-400">No active goals.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HealthTracker;
