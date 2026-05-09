import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Download } from 'lucide-react';

const Reports = () => {
    const { user } = useSelector(state => state.auth);
    const [stats, setStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get('/api/health/stats/monthly', config);
                setStats(res.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load stats", error);
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    if (isLoading) return <LoadingSkeleton count={3} className="h-64" />;

    const avgCalories = stats.length ? Math.round(stats.reduce((acc, curr) => acc + curr.calories, 0) / stats.length) : 0;
    const avgSleep = stats.length ? (stats.reduce((acc, curr) => acc + curr.sleepHours, 0) / stats.length).toFixed(1) : 0;
    const avgWater = stats.length ? (stats.reduce((acc, curr) => acc + curr.waterIntake, 0) / stats.length).toFixed(1) : 0;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-heading font-bold">Health Reports</h1>
                <button className="flex items-center gap-2 bg-brand-card border border-brand-cyan text-brand-cyan px-4 py-2 rounded hover:bg-brand-cyan hover:text-brand-dark transition-colors">
                    <Download size={18} /> Export
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="glass-card p-6 border-l-4 border-brand-warning">
                    <h4 className="text-brand-muted text-sm">Avg. Calories</h4>
                    <p className="text-2xl font-bold">{avgCalories} kcal</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-purple-400">
                    <h4 className="text-brand-muted text-sm">Avg. Sleep</h4>
                    <p className="text-2xl font-bold">{avgSleep} hrs</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-blue-400">
                    <h4 className="text-brand-muted text-sm">Avg. Water</h4>
                    <p className="text-2xl font-bold">{avgWater} glasses</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 h-80">
                    <h3 className="font-heading font-bold mb-4">Calorie Trend</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={stats}>
                            <defs>
                                <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#8892b0" />
                            <YAxis stroke="#8892b0" />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0f1e', borderColor: '#00d4ff' }} />
                            <Area type="monotone" dataKey="calories" stroke="#00d4ff" fillOpacity={1} fill="url(#colorCal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-card p-6 h-80">
                    <h3 className="font-heading font-bold mb-4">Sleep Quality</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={stats}>
                            <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#8892b0" />
                            <YAxis stroke="#8892b0" />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0f1e', borderColor: '#00ff9d' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                            <Bar dataKey="sleepHours" fill="#00ff9d" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-card p-6 h-80 lg:col-span-2">
                    <h3 className="font-heading font-bold mb-4">Weight Trend</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={stats}>
                            <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#8892b0" />
                            <YAxis domain={['auto', 'auto']} stroke="#8892b0" />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0f1e', borderColor: '#ff4757' }} />
                            <Line type="monotone" dataKey="weight" stroke="#ff4757" strokeWidth={3} dot={{ fill: '#ff4757', strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;
