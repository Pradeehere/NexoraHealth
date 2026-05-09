import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
                    // Fallback array just in case
                    setAiSuggestions(["Stay hydrated and maintain consistent sleep."]);
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
                setIsLoading(false);
            }
        };
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (isLoading) return <LoadingSkeleton count={4} className="h-40" />;

    const getBMIBadgeColor = (bmi) => {
        if (bmi < 18.5) return 'bg-blue-500 text-white';
        if (bmi >= 18.5 && bmi < 24.9) return 'bg-brand-green text-brand-dark';
        if (bmi >= 25 && bmi < 29.9) return 'bg-brand-warning text-brand-dark';
        return 'bg-brand-danger text-white';
    };

    const bmi = user.weight && user.height ? (user.weight / Math.pow(user.height / 100, 2)).toFixed(1) : 0;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-brand-text">Good Morning, {user.name.split(' ')[0]} 👋</h1>
                    <p className="text-brand-muted">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </header>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-6 flex flex-col items-center">
                    <Flame className="text-brand-warning w-8 h-8 mb-2" />
                    <h3 className="text-brand-muted text-sm">Calories Today</h3>
                    <p className="text-2xl font-bold">{healthData?.calories || 0}</p>
                </div>
                <div className="glass-card p-6 flex flex-col items-center relative overflow-hidden">
                    <Droplets className="text-blue-400 w-8 h-8 mb-2 z-10" />
                    <h3 className="text-brand-muted text-sm z-10">Water Intake</h3>
                    <p className="text-2xl font-bold z-10">{healthData?.waterIntake || 0} / 8</p>
                    <div
                        className="absolute bottom-0 left-0 w-full bg-blue-500/20 transition-all duration-1000"
                        style={{ height: `${Math.min(((healthData?.waterIntake || 0) / 8) * 100, 100)}%` }}
                    />
                </div>
                <div className="glass-card p-6 flex flex-col items-center">
                    <Moon className="text-purple-400 w-8 h-8 mb-2" />
                    <h3 className="text-brand-muted text-sm">Sleep Hours</h3>
                    <p className="text-2xl font-bold">{healthData?.sleepHours || 0}</p>
                </div>
                <div className="glass-card p-6 flex flex-col items-center">
                    <Scale className="text-brand-cyan w-8 h-8 mb-2" />
                    <h3 className="text-brand-muted text-sm flex items-center justify-between w-full px-4">
                        BMI <span className={`px-2 py-0.5 rounded text-xs font-bold ${getBMIBadgeColor(bmi)}`}>{bmi}</span>
                    </h3>
                    <p className="text-2xl font-bold">{user.weight || 0} kg</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Charts Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-6 h-80">
                        <h3 className="font-heading font-bold mb-4">Calorie Trend (Last 7 Days)</h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <LineChart data={weeklyData}>
                                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#8892b0" />
                                <YAxis stroke="#8892b0" />
                                <Tooltip contentStyle={{ backgroundColor: '#0a0f1e', borderColor: '#00d4ff' }} />
                                <Line type="monotone" dataKey="calories" stroke="#00d4ff" strokeWidth={3} dot={{ fill: '#00d4ff', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="glass-card p-6 h-80">
                        <h3 className="font-heading font-bold mb-4">Sleep Quality (Last 7 Days)</h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={weeklyData}>
                                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#8892b0" />
                                <YAxis stroke="#8892b0" />
                                <Tooltip contentStyle={{ backgroundColor: '#0a0f1e', borderColor: '#00d4ff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="sleepHours" fill="#00ff9d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Sidebar Column */}
                <div className="space-y-6">
                    <div className="glass-card p-6 border-brand-cyan/30 border-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="text-brand-cyan" />
                            <h3 className="font-heading font-bold text-brand-cyan">Nexora AI Insights</h3>
                        </div>
                        <ul className="space-y-4">
                            {aiSuggestions.map((tip, idx) => (
                                <li key={idx} className="bg-brand-dark/50 p-3 rounded-lg text-sm text-brand-text/90 flex gap-2 items-start">
                                    <span className="text-brand-cyan mt-1">•</span>
                                    <span>{tip}</span>
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
