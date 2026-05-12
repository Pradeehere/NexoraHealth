import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Brain, Flame, Droplets, Moon, Scale, Sparkles } from 'lucide-react';
import axios from 'axios';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import HealthScoreRing from '../components/dashboard/HealthScoreRing';
import WaterTracker from '../components/dashboard/WaterTracker';
import MoodTracker from '../components/dashboard/MoodTracker';
import StreakCard from '../components/dashboard/StreakCard';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [healthData, setHealthData] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

            // FALLBACK: Robust 7-day mock data
            const generateDate = (offset) => {
                const d = new Date();
                d.setDate(d.getDate() - offset);
                return d.toISOString();
            };

            setHealthData({
                calories: 2150,
                waterIntake: 8,
                sleepHours: 7,
                mood: 4
            });

            setWeeklyData([
                { date: generateDate(6), calories: 2100, sleepHours: 7 },
                { date: generateDate(5), calories: 2300, sleepHours: 6.5 },
                { date: generateDate(4), calories: 1950, sleepHours: 8 },
                { date: generateDate(3), calories: 2200, sleepHours: 7 },
                { date: generateDate(2), calories: 2100, sleepHours: 6.5 },
                { date: generateDate(1), calories: 2400, sleepHours: 7.5 },
                { date: generateDate(0), calories: 2150, sleepHours: 7 }
            ]);

            setAiSuggestions([
                "Maintain your current water intake consistency for better hydration.",
                "Consider adding 15 minutes of cardio to burn those extra calories.",
                "Your sleep pattern shows slight irregularity; aim for 8 hours tonight.",
                "Great job maintaining your weight target!",
                "Consider practicing mindfulness to improve your daily mood score.",
                "Add a protein source to every meal to stay fuller longer and support muscle maintenance.",
                "Practice 5 minutes of deep breathing or meditation before bed to improve sleep quality.",
                "Limit screen time 1 hour before sleep — blue light suppresses melatonin production.",
                "Include at least 3 different colored vegetables in your meals today.",
                "Do 20 minutes of moderate exercise today — even a brisk walk counts."
            ]);

            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (isLoading) return <LoadingSkeleton count={4} className="h-40" />;

    const storedBMI = (() => { try { const s = localStorage.getItem('nexora_bmi'); return s ? JSON.parse(s).value : null; } catch { return null; } })();
    const bmi = storedBMI ?? (user.weight && user.height ? (user.weight / Math.pow(user.height / 100, 2)).toFixed(1) : 0);

    return (
        <div className="min-h-screen bg-white">
            {/* Top Banner with Stats Overlay */}
            <div className="relative h-64 md:h-80 bg-black overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80"
                    alt="Wellness"
                    className="w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="animate-slide-up">
                        <h1 className="text-[36px] md:text-[48px] font-cormorant font-medium text-white tracking-tight italic leading-tight">
                            Good Morning, {user?.name?.split(' ')[0]}
                        </h1>
                        <p className="text-white/70 font-inter text-[15px] tracking-wide mt-2 uppercase">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex gap-4 md:gap-8 bg-white/10 backdrop-blur-md p-6 border border-white/20 animate-fade-in">
                        {[
                            { label: 'CALORIES', val: healthData?.calories || 0, unit: 'kcal' },
                            { label: 'WATER', val: healthData?.waterIntake || 0, unit: 'glasses' },
                            { label: 'SLEEP', val: healthData?.sleepHours || 0, unit: 'hrs' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center min-w-[80px]">
                                <p className="text-[11px] font-inter font-bold text-brand-gold tracking-[0.2em] mb-1 uppercase">{stat.label}</p>
                                <p className="text-2xl font-cormorant text-white">{stat.val}<span className="text-[10px] ml-1 opacity-60 font-inter">{stat.unit}</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column - Main Trackers */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                <WaterTracker 
                                    current={healthData?.waterIntake || 0} 
                                    goal={8} 
                                    onUpdate={(val) => setHealthData(prev => ({...prev, waterIntake: val}))}
                                    recordId={healthData?._id}
                                />
                            </div>
                            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <MoodTracker 
                                    todayMood={healthData?.mood} 
                                    onMoodSelect={(val) => setHealthData(prev => ({...prev, mood: val}))}
                                    recordId={healthData?._id}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                                <StreakCard />
                            </div>
                            <div className="md:col-span-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                                <div className="border border-black p-8 h-full bg-white group hover:border-brand-gold transition-colors duration-500">
                                    <div className="flex justify-between items-center mb-8">
                                        <p className="text-[12px] font-inter font-semibold text-brand-gold tracking-[0.15em] uppercase">ACTIVITY TRENDS</p>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-black"></div>
                                                <span className="text-[10px] font-inter uppercase tracking-widest text-gray-400">Calories</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-brand-gold"></div>
                                                <span className="text-[10px] font-inter uppercase tracking-widest text-gray-400">Sleep</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[240px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={weeklyData}>
                                                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#000" strokeOpacity={0.05} />
                                                <XAxis 
                                                    dataKey="date" 
                                                    tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { weekday: 'short' })} 
                                                    stroke="#000" 
                                                    tick={{ fontFamily: 'Inter', fontSize: 10 }} 
                                                />
                                                <YAxis stroke="#000" tick={{ fontFamily: 'Inter', fontSize: 10 }} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '0' }}
                                                    itemStyle={{ color: '#C9A84C', fontFamily: 'Inter', fontSize: '12px' }}
                                                    labelStyle={{ color: '#fff', fontFamily: 'Inter', fontSize: '10px', marginBottom: '4px' }}
                                                />
                                                <Line type="monotone" dataKey="calories" stroke="#000" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                                <Line type="monotone" dataKey="sleepHours" stroke="#C9A84C" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Health Score Component */}
                        <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                            <HealthScoreRing />
                        </div>
                    </div>

                    {/* Right Column - AI Insights */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-8 space-y-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                            <div className="border border-black p-8 bg-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-700" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 bg-black flex items-center justify-center text-brand-gold">
                                            <Sparkles size={20} />
                                        </div>
                                        <p className="text-[12px] font-inter font-bold text-brand-gold tracking-[0.2em] uppercase">NEXORA AI INSIGHTS</p>
                                    </div>

                                    <div className="max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                                        {aiSuggestions.length > 0 ? (
                                            <div className="space-y-6">
                                                {aiSuggestions.map((tip, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="group/tip p-4 border-l-2 border-brand-gold/30 hover:border-brand-gold bg-gray-50/50 hover:bg-white transition-all duration-300"
                                                    >
                                                        <span className="text-[11px] font-inter font-bold text-brand-gold/50 group-hover/tip:text-brand-gold tracking-widest uppercase mb-2 block">
                                                            Tip {(idx + 1).toString().padStart(2, '0')}
                                                        </span>
                                                        <p className="text-[15px] font-inter text-[#333] leading-[1.8] font-normal">
                                                            {tip}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-12 text-center">
                                                <div className="w-12 h-12 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mx-auto mb-4" />
                                                <p className="text-gray-400 font-jakarta text-xs uppercase tracking-widest">Analyzing your wellness data...</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-100">
                                        <p className="text-[10px] text-gray-400 font-jakarta italic tracking-wide">
                                            Our AI analyzes your sleep, nutrition, and activity patterns to provide high-precision health optimizations.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Motivational Card */}
                            <div className="bg-black p-8 text-center group cursor-pointer overflow-hidden relative">
                                <div className="absolute inset-0 bg-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <p className="text-brand-gold font-cormorant italic text-2xl mb-4 relative z-10">"Health is the ultimate luxury."</p>
                                <div className="h-[1px] w-12 bg-brand-gold/50 mx-auto group-hover:w-24 transition-all duration-500 relative z-10" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #C9A84C;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
