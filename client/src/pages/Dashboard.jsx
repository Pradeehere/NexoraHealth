import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Brain, Flame, Droplets, Moon, Scale } from 'lucide-react';
import axios from 'axios';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [healthData, setHealthData] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const [recordsRes, weeklyRes] = await Promise.all([
                    axios.get('/api/health', config),
                    axios.get('/api/health/stats/weekly', config)
                ]);

                const records = recordsRes.data;
                const todayRecord = records.find(r =>
                    new Date(r.date).toDateString() === new Date().toDateString()
                ) || null;

                setHealthData(todayRecord);
                setWeeklyData(weeklyRes.data);

                // Fetch AI suggestions
                try {
                    const aiRes = await axios.post('/api/ai/suggestions', todayRecord || {}, config);
                    setAiSuggestions(aiRes.data.suggestions);
                } catch (err) {
                    console.error("AI error", err);
                    setAiSuggestions(["Maintain a balanced luxury lifestyle with consistent sleep and optimal hydration."]);
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Dashboard fetch error:", error);

                // FALLBACK: If user is bypass guest or network fails, show mock data
                if (user.id?.includes('bypass') || !healthData) {
                    setHealthData({
                        calories: 2150,
                        waterIntake: 6,
                        sleepHours: 7,
                        mood: 4
                    });
                    setWeeklyData([
                        { date: new Date(Date.now() - 6 * 86400000), calories: 2100, sleepHours: 7 },
                        { date: new Date(Date.now() - 5 * 86400000), calories: 2300, sleepHours: 6 },
                        { date: new Date(Date.now() - 4 * 86400000), calories: 1950, sleepHours: 8 },
                        { date: new Date(Date.now() - 3 * 86400000), calories: 2200, sleepHours: 7 },
                        { date: new Date(Date.now() - 2 * 86400000), calories: 2100, sleepHours: 7.5 },
                        { date: new Date(Date.now() - 1 * 86400000), calories: 2400, sleepHours: 6.5 },
                        { date: new Date(), calories: 2150, sleepHours: 7 }
                    ]);
                    setAiSuggestions([
                        "Your hydration levels are improving but aim for 2 more glasses today.",
                        "Consider earlier sleep tonight to optimize recovery for tomorrow.",
                        "Your caloric consistency is excellent this week."
                    ]);
                }
                setIsLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (isLoading) return <LoadingSkeleton count={4} className="h-40" />;

    const storedBMI = (() => { try { const s = localStorage.getItem('nexora_bmi'); return s ? JSON.parse(s).value : null; } catch { return null; } })();
    const bmi = storedBMI ?? (user.weight && user.height ? (user.weight / Math.pow(user.height / 100, 2)).toFixed(1) : 0);

    return (
        <div className="space-y-8 animate-fade-in-up pb-12">
            <header className="bg-white border-b border-black pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl md:text-5xl font-jost font-medium text-black tracking-tight">
                        Good Morning, {user.name.split(' ')[0]}
                    </h1>
                </div>
                <div className="font-jost small-caps text-sm text-[#555] tracking-widest uppercase">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Calories Today", value: healthData?.calories || 0, icon: Flame },
                    { label: "Water Intake", value: `${healthData?.waterIntake || 0} / 8`, icon: Droplets },
                    { label: "Sleep Hours", value: healthData?.sleepHours || 0, icon: Moon },
                    { label: "BMI", value: bmi, icon: Scale }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-black p-6 flex flex-col relative group hover:bg-black transition-colors duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-jost text-sm text-gray-500 font-medium uppercase tracking-widest">{stat.label}</h3>
                            <stat.icon className="text-black group-hover:text-white transition-colors w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <p className="font-jost font-medium text-5xl text-black group-hover:text-white transition-colors">{stat.value}</p>

                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold"></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Charts Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border border-black p-8 h-[400px]">
                        <h3 className="font-jost text-sm uppercase tracking-widest text-gray-500 mb-8 font-medium">Calorie Trend (Last 7 Days)</h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <LineChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#000" tick={{ fontFamily: 'Jost', fontSize: 12 }} />
                                <YAxis stroke="#000" tick={{ fontFamily: 'Jost', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', borderColor: '#000', borderRadius: '0', color: '#fff' }}
                                    itemStyle={{ color: '#C9A84C' }}
                                />
                                <Line type="monotone" dataKey="calories" stroke="#C9A84C" strokeWidth={2} dot={{ fill: '#000', stroke: '#C9A84C', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white border border-black p-8 h-[400px]">
                        <h3 className="font-jost text-sm uppercase tracking-widest text-gray-500 mb-8 font-medium">Sleep Quality (Last 7 Days)</h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#000" tick={{ fontFamily: 'Jost', fontSize: 12 }} />
                                <YAxis stroke="#000" tick={{ fontFamily: 'Jost', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', borderColor: '#000', borderRadius: '0', color: '#fff' }}
                                    cursor={{ fill: '#f5f5f5' }}
                                    itemStyle={{ color: '#C9A84C' }}
                                />
                                <Bar dataKey="sleepHours" fill="#C9A84C" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Insights Column */}
                <div className="space-y-8">
                    <div className="bg-white border border-black p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Brain className="text-black w-6 h-6" strokeWidth={1.5} />
                            <h3 className="font-jost font-medium text-lg text-black tracking-wide">NEXORA AI INSIGHTS</h3>
                        </div>
                        <ul className="space-y-6">
                            {aiSuggestions.map((tip, idx) => (
                                <li key={idx} className="pl-4 border-l-2 border-black text-gray-700 font-jost text-base leading-relaxed">
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
