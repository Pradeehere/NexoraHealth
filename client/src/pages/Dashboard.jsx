import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Brain, Flame, Droplets, Moon, Scale } from 'lucide-react';
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
                "Consider practicing mindfulness to improve your daily mood score."
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

    const handleUpdate = () => {
        fetchDashboardData();
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-12">
            <header className="bg-white border-b border-black pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-[36px] md:text-[52px] font-cormorant font-medium text-black tracking-tight italic leading-tight">
                        Good Morning, {user.name.split(' ')[0]}
                    </h1>
                    <div className="h-[2px] w-32 bg-brand-gold mt-2"></div>
                </div>
                <div className="font-jost text-[15px] text-[#666] tracking-[0.05em] uppercase">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            {/* AI Health Score Ring - Hero Element */}
            <HealthScoreRing />

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* CALORIES */}
                <div className="border border-black p-6 flex flex-col relative bg-white transition-all duration-300">
                    <p style={{ fontFamily: 'DM Serif Display, serif', fontSize: '14px', letterSpacing: '0.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 400 }}>CALORIES TODAY</p>
                    <div className="flex items-baseline">
                        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '56px', fontWeight: 600, color: '#000', lineHeight: 1 }}>{healthData?.calories || 0}</p>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'inline-block', marginLeft: '6px' }}>KCAL</span>
                    </div>
                </div>

                {/* WATER TRACKER */}
                <WaterTracker 
                    current={healthData?.waterIntake || 0} 
                    goal={8} 
                    onUpdate={(val) => setHealthData(prev => ({...prev, waterIntake: val}))}
                    recordId={healthData?._id}
                />

                {/* SLEEP */}
                <div className="border border-black p-6 flex flex-col relative bg-white transition-all duration-300">
                    <p style={{ fontFamily: 'DM Serif Display, serif', fontSize: '14px', letterSpacing: '0.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 400 }}>SLEEP HOURS</p>
                    <div className="flex items-baseline">
                        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '56px', fontWeight: 600, color: '#000', lineHeight: 1 }}>{healthData?.sleepHours || 0}</p>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'inline-block', marginLeft: '6px' }}>HRS</span>
                    </div>
                </div>

                {/* BMI */}
                <div className="border border-black p-6 flex flex-col relative bg-white transition-all duration-300">
                    <p style={{ fontFamily: 'DM Serif Display, serif', fontSize: '14px', letterSpacing: '0.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 400 }}>BMI INDEX</p>
                    <div className="flex items-baseline">
                        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '56px', fontWeight: 600, color: '#000', lineHeight: 1 }}>{bmi}</p>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'inline-block', marginLeft: '6px' }}>KG/M²</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Charts Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="chart-container h-fit" style={{ border: '1px solid #000', padding: '32px' }}>
                        <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '15px', letterSpacing: '0.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 400 }}>CALORIE TREND (LAST 7 DAYS)</h3>
                        {weeklyData.length > 0 ? (
                            <div style={{ width: '100%', minHeight: 0 }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={weeklyData}>
                                        <CartesianGrid strokeDasharray="0" vertical={false} stroke="#000" strokeOpacity={0.1} />
                                        <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#000" tick={{ fontFamily: 'Inter', fontSize: 10, textTransform: 'uppercase' }} />
                                        <YAxis stroke="#000" tick={{ fontFamily: 'Inter', fontSize: 10 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff' }}
                                            itemStyle={{ color: '#C9A84C', fontFamily: 'Inter', textTransform: 'uppercase', fontSize: '10px' }}
                                            labelStyle={{ color: '#fff', marginBottom: '4px' }}
                                        />
                                        <Line type="monotone" dataKey="calories" stroke="#C9A84C" strokeWidth={2} dot={{ fill: '#000', stroke: '#C9A84C', strokeWidth: 1, r: 3 }} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="no-data-msg">
                                <p style={{ fontFamily: 'DM Serif Display', color: '#C9A84C' }}>NO DATA AVAILABLE</p>
                                <div className="no-data-hr"></div>
                            </div>
                        )}
                    </div>

                    <div className="chart-container h-fit" style={{ border: '1px solid #000', padding: '32px' }}>
                        <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '15px', letterSpacing: '0.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 400 }}>SLEEP QUALITY (LAST 7 DAYS)</h3>
                        {weeklyData.length > 0 ? (
                            <div style={{ width: '100%', minHeight: 0 }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={weeklyData}>
                                        <CartesianGrid strokeDasharray="0" vertical={false} stroke="#000" strokeOpacity={0.1} />
                                        <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#000" tick={{ fontFamily: 'Inter', fontSize: 10, textTransform: 'uppercase' }} />
                                        <YAxis stroke="#000" tick={{ fontFamily: 'Inter', fontSize: 10 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff' }}
                                            cursor={{ fill: 'rgba(201, 168, 76, 0.05)' }}
                                            itemStyle={{ color: '#C9A84C', fontFamily: 'Inter', textTransform: 'uppercase', fontSize: '10px' }}
                                            labelStyle={{ color: '#fff', marginBottom: '4px' }}
                                        />
                                        <Bar dataKey="sleepHours" fill="#C9A84C" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="no-data-msg">
                                <p style={{ fontFamily: 'DM Serif Display', color: '#C9A84C' }}>NO DATA AVAILABLE</p>
                                <div className="no-data-hr"></div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MoodTracker 
                            todayMood={healthData?.mood} 
                            onMoodSelect={(val) => setHealthData(prev => ({...prev, mood: val}))}
                            recordId={healthData?._id}
                        />
                        <StreakCard />
                    </div>
                </div>

                {/* AI Insights Column */}
                <div className="space-y-6">
                    <div className="border border-black p-8 bg-white h-full max-h-[1000px] flex flex-col">
                        <div className="flex items-center gap-3 mb-6 flex-shrink-0">
                            <Brain className="text-brand-gold w-6 h-6" strokeWidth={1} />
                            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '15px', letterSpacing: '0.15em', color: '#C9A84C', textTransform: 'uppercase', margin: 0, fontWeight: 400 }}>NEXORA AI INSIGHTS</h3>
                        </div>
                        <div className="overflow-y-auto flex-1 pr-4 custom-scrollbar" style={{ maxHeight: '800px' }}>
                            <ul className="space-y-6">
                                {aiSuggestions.slice(0, 10).map((tip, idx) => (
                                    <li key={idx} className="pl-4 border-l-[3px] border-brand-gold relative">
                                        <span style={{ 
                                            fontFamily: 'DM Serif Display, serif', 
                                            fontSize: '13px', 
                                            color: '#C9A84C', 
                                            display: 'block',
                                            marginBottom: '4px'
                                        }}>
                                            {(idx + 1).toString().padStart(2, '0')}
                                        </span>
                                        <p style={{ 
                                            fontFamily: 'Inter, sans-serif', 
                                            fontSize: '15px', 
                                            color: '#333', 
                                            lineHeight: 1.8 
                                        }}>
                                            {String(tip)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
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
                </div>
            </div>
        </div>
    );

};

export default Dashboard;

