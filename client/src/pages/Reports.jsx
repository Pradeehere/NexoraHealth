import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, CartesianGrid } from 'recharts';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Printer, Download } from 'lucide-react';

const Reports = () => {
    const { user } = useSelector(state => state.auth);
    const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'monthly'
    const [stats, setStats] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const endpoint = viewMode === 'weekly' ? '/api/health/stats/weekly' : '/api/health/stats/monthly';

                const [statsRes, exerciseRes] = await Promise.allSettled([
                    axios.get(endpoint, config),
                    axios.get('/api/exercises', config)
                ]);

                if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
                if (exerciseRes.status === 'fulfilled') setExercises(exerciseRes.value.data);

                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load stats", error);
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [user, viewMode]);

    const avgCalories = stats.length ? Math.round(stats.reduce((acc, curr) => acc + (curr.calories || 0), 0) / stats.length) : 0;
    const avgSleep = stats.length ? (stats.reduce((acc, curr) => acc + (curr.sleepHours || 0), 0) / stats.length).toFixed(1) : 0;
    const avgWater = stats.length ? (stats.reduce((acc, curr) => acc + (curr.waterIntake || 0), 0) / stats.length).toFixed(1) : 0;

    // Calculate total exercise minutes (for the currently selected time window roughly based on stats length)
    // To be precise we could filter exercises by date, but as a simple summary we sum them up.
    // If weekly, we take last 7 days. If monthly, last 30 days.
    const now = new Date();
    const daysToFilter = viewMode === 'weekly' ? 7 : 30;
    const filteredExercises = exercises.filter(ex => {
        const diffTime = Math.abs(now - new Date(ex.createdAt || ex.date));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= daysToFilter;
    });
    const totalExerciseMins = filteredExercises.reduce((acc, curr) => acc + (curr.duration || 0), 0);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading && stats.length === 0) return <LoadingSkeleton count={3} className="h-64" />;

    return (
        <div className="space-y-8 animate-fade-in-up pb-12 print:text-black print:bg-white print:m-0 print:p-0">
            {/* Action Bar (Hidden when printing) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black pb-6 print:hidden">
                <div>
                    <h1 className="text-4xl md:text-5xl font-cormorant italic font-bold text-black uppercase tracking-wide mb-4">
                        Health Reports
                    </h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setViewMode('weekly')}
                            className={`font-tenor uppercase tracking-widest text-sm pb-1 transition-colors ${viewMode === 'weekly' ? 'border-b-2 border-brand-gold text-black' : 'text-[#888] hover:text-black'}`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setViewMode('monthly')}
                            className={`font-tenor uppercase tracking-widest text-sm pb-1 transition-colors ${viewMode === 'monthly' ? 'border-b-2 border-brand-gold text-black' : 'text-[#888] hover:text-black'}`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={handlePrint} className="flex items-center gap-2 bg-white border border-black text-black px-6 py-3 hover:bg-gray-100 transition-colors font-tenor uppercase tracking-widest text-xs">
                        <Printer size={16} strokeWidth={1} /> Print
                    </button>
                    <button onClick={handlePrint} className="flex items-center gap-2 bg-black border border-black text-white px-6 py-3 hover:bg-brand-gold hover:border-brand-gold transition-colors font-tenor uppercase tracking-widest text-xs">
                        <Download size={16} strokeWidth={1} /> Export as PDF
                    </button>
                </div>
            </div>

            {/* Print Only Header */}
            <div className="hidden print:block text-center border-b border-black pb-8 mb-8">
                <h1 className="text-5xl font-cormorant italic font-bold tracking-wide">NEXORA HEALTH</h1>
                <p className="font-tenor uppercase tracking-[0.2em] mt-4">{viewMode} Report for {user.name}</p>
            </div>

            {/* Summary Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-y border-black bg-white">
                <div className="p-8 border-r border-b lg:border-b-0 border-black flex flex-col justify-between">
                    <h4 className="font-tenor uppercase tracking-[0.15em] text-xs text-brand-gold mb-4">Avg. Calories</h4>
                    <p className="font-cormorant font-bold text-4xl">{avgCalories}</p>
                </div>
                <div className="p-8 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-between">
                    <h4 className="font-tenor uppercase tracking-[0.15em] text-xs text-brand-gold mb-4">Avg. Sleep (hrs)</h4>
                    <p className="font-cormorant font-bold text-4xl">{avgSleep}</p>
                </div>
                <div className="p-8 border-r border-black flex flex-col justify-between">
                    <h4 className="font-tenor uppercase tracking-[0.15em] text-xs text-brand-gold mb-4">Avg. Water (gls)</h4>
                    <p className="font-cormorant font-bold text-4xl">{avgWater}</p>
                </div>
                <div className="p-8 flex flex-col justify-between">
                    <h4 className="font-tenor uppercase tracking-[0.15em] text-xs text-brand-gold mb-4">Total Exercise (m)</h4>
                    <p className="font-cormorant font-bold text-4xl">{totalExerciseMins || 0}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:break-inside-avoid">
                {/* Chart 1: Calorie Trend */}
                <div className="chart-container h-[400px]">
                    <h3 className="chart-title">Calorie Trend</h3>
                    {stats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="90%">
                            <AreaChart data={stats}>
                                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#000" strokeOpacity={0.1} />
                                <defs>
                                    <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#000" tick={{ fontFamily: 'Tenor Sans', fontSize: 10, textTransform: 'uppercase' }} />
                                <YAxis stroke="#000" tick={{ fontFamily: 'Tenor Sans', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff' }} labelStyle={{ color: '#fff', marginBottom: '4px' }} itemStyle={{ color: '#C9A84C', fontFamily: 'Tenor Sans', textTransform: 'uppercase', fontSize: '10px' }} />
                                <Area type="monotone" dataKey="calories" stroke="#C9A84C" fillOpacity={1} fill="url(#colorCal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no-data-msg">NO DATA AVAILABLE<div className="no-data-hr"></div></div>
                    )}
                </div>

                {/* Chart 2: Sleep Quality */}
                <div className="chart-container h-[400px]">
                    <h3 className="chart-title">Sleep Quality</h3>
                    {stats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={stats}>
                                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#000" strokeOpacity={0.1} />
                                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#000" tick={{ fontFamily: 'Tenor Sans', fontSize: 10, textTransform: 'uppercase' }} />
                                <YAxis stroke="#000" tick={{ fontFamily: 'Tenor Sans', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff' }} labelStyle={{ color: '#fff', marginBottom: '4px' }} itemStyle={{ color: '#C9A84C', fontFamily: 'Tenor Sans', textTransform: 'uppercase', fontSize: '10px' }} cursor={{ fill: 'rgba(201, 168, 76, 0.05)' }} />
                                <Bar dataKey="sleepHours" fill="#C9A84C" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no-data-msg">NO DATA AVAILABLE<div className="no-data-hr"></div></div>
                    )}
                </div>

                {/* Chart 3: Weight Trend */}
                <div className="chart-container h-[400px] lg:col-span-2">
                    <h3 className="chart-title">Weight Trend</h3>
                    {stats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={stats}>
                                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#000" strokeOpacity={0.1} />
                                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#000" tick={{ fontFamily: 'Tenor Sans', fontSize: 10, textTransform: 'uppercase' }} />
                                <YAxis domain={['auto', 'auto']} stroke="#000" tick={{ fontFamily: 'Tenor Sans', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff' }} labelStyle={{ color: '#fff', marginBottom: '4px' }} itemStyle={{ color: '#C9A84C', fontFamily: 'Tenor Sans', textTransform: 'uppercase', fontSize: '10px' }} />
                                <Line type="monotone" dataKey="weight" stroke="#C9A84C" strokeWidth={2} dot={{ fill: '#000', stroke: '#C9A84C', strokeWidth: 1, r: 3 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no-data-msg">NO DATA AVAILABLE<div className="no-data-hr"></div></div>
                    )}
                </div>

                {/* Chart 4: Water Intake */}
                <div className="chart-container h-[400px] lg:col-span-2 print:break-inside-avoid">
                    <h3 className="chart-title">Water Intake</h3>
                    {stats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={stats}>
                                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#000" strokeOpacity={0.1} />
                                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#000" tick={{ fontFamily: 'Tenor Sans', fontSize: 10, textTransform: 'uppercase' }} />
                                <YAxis domain={[0, 'auto']} stroke="#000" tick={{ fontFamily: 'Tenor Sans', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff' }} labelStyle={{ color: '#fff', marginBottom: '4px' }} itemStyle={{ color: '#C9A84C', fontFamily: 'Tenor Sans', textTransform: 'uppercase', fontSize: '10px' }} />
                                <Line type="monotone" dataKey="waterIntake" stroke="#C9A84C" strokeWidth={2} dot={{ fill: '#000', stroke: '#C9A84C', strokeWidth: 1, r: 3 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no-data-msg">NO DATA AVAILABLE<div className="no-data-hr"></div></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
