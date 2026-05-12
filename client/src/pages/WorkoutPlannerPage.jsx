import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Dumbbell, Save, RefreshCw, CheckCircle2, ChevronRight, Info } from 'lucide-react';

const WorkoutPlannerPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);
    const [formData, setFormData] = useState({
        fitnessGoal: 'Stay Active',
        fitnessLevel: 'Beginner',
        daysPerWeek: 3,
        duration: 45,
        equipment: 'No Equipment'
    });

    const bmi = (user?.weight && user?.height) 
        ? (user.weight / Math.pow(user.height / 100, 2)).toFixed(1) 
        : 22.5;

    const handleGenerate = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.post('/api/ai/workout-plan', { ...formData, bmi }, config);
            setPlan(data);
            localStorage.setItem('nexora_workout_plan', JSON.stringify(data));
        } catch (err) {
            console.error("Workout generation error", err);
            alert("Failed to generate workout plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedPlan = localStorage.getItem('nexora_workout_plan');
        if (savedPlan) {
            setPlan(JSON.parse(savedPlan));
        }
    }, []);

    const handleSave = () => {
        if (plan) {
            localStorage.setItem('nexora_workout_plan', JSON.stringify(plan));
            alert("Workout plan saved successfully!");
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto p-8 md:p-12 animate-fade-in">
            {/* Header */}
            <header className="mb-12">
                <p className="font-jakarta font-bold text-brand-gold text-[12px] tracking-[0.2em] uppercase mb-3">AI WORKOUT GENERATOR</p>
                <h1 className="font-playfair italic text-[48px] text-black leading-tight mb-4">Your Personal Workout Plan</h1>
                <p className="font-jakarta text-[15px] text-gray-500">Generated based on your BMI and fitness goals.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="border border-black p-8 bg-white sticky top-8">
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div>
                                <label className="block font-jakarta font-bold text-[11px] text-gray-400 tracking-widest uppercase mb-2">Fitness Goal</label>
                                <select 
                                    className="w-full border border-gray-200 p-4 font-jakarta text-[14px] focus:border-black outline-none transition-colors"
                                    value={formData.fitnessGoal}
                                    onChange={(e) => setFormData({...formData, fitnessGoal: e.target.value})}
                                >
                                    {['Weight Loss', 'Muscle Gain', 'Improve Stamina', 'Stay Active', 'Flexibility'].map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-jakarta font-bold text-[11px] text-gray-400 tracking-widest uppercase mb-2">Fitness Level</label>
                                <select 
                                    className="w-full border border-gray-200 p-4 font-jakarta text-[14px] focus:border-black outline-none transition-colors"
                                    value={formData.fitnessLevel}
                                    onChange={(e) => setFormData({...formData, fitnessLevel: e.target.value})}
                                >
                                    {['Beginner', 'Intermediate', 'Advanced'].map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-jakarta font-bold text-[11px] text-gray-400 tracking-widest uppercase mb-2">Days / Week</label>
                                    <select 
                                        className="w-full border border-gray-200 p-4 font-jakarta text-[14px] focus:border-black outline-none transition-colors"
                                        value={formData.daysPerWeek}
                                        onChange={(e) => setFormData({...formData, daysPerWeek: Number(e.target.value)})}
                                    >
                                        {[3, 4, 5, 6].map(opt => (
                                            <option key={opt} value={opt}>{opt} Days</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-jakarta font-bold text-[11px] text-gray-400 tracking-widest uppercase mb-2">Duration</label>
                                    <select 
                                        className="w-full border border-gray-200 p-4 font-jakarta text-[14px] focus:border-black outline-none transition-colors"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                                    >
                                        {[30, 45, 60].map(opt => (
                                            <option key={opt} value={opt}>{opt} Mins</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-jakarta font-bold text-[11px] text-gray-400 tracking-widest uppercase mb-2">Equipment</label>
                                <select 
                                    className="w-full border border-gray-200 p-4 font-jakarta text-[14px] focus:border-black outline-none transition-colors"
                                    value={formData.equipment}
                                    onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                                >
                                    {['No Equipment', 'Basic (dumbbells)', 'Full Gym'].map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="font-jakarta text-[13px] text-gray-400">Your BMI:</span>
                                <span className="font-playfair font-bold text-[18px] text-black">{bmi}</span>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white h-[48px] font-jakarta font-bold text-[13px] tracking-widest uppercase hover:bg-brand-gold transition-colors duration-300 disabled:bg-gray-300"
                            >
                                {loading ? 'Crafting Plan...' : 'Generate Workout Plan'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <p className="font-playfair italic text-[24px] text-black mb-6">Crafting your personalized workout plan...</p>
                            <div className="w-48 h-[2px] bg-gray-100 relative overflow-hidden">
                                <div className="absolute inset-0 bg-brand-gold animate-pulse-width" />
                            </div>
                            <style>{`
                                @keyframes pulse-width {
                                    0% { width: 0; left: 0; }
                                    50% { width: 100%; left: 0; }
                                    100% { width: 0; left: 100%; }
                                }
                                .animate-pulse-width { animation: pulse-width 2s infinite linear; }
                            `}</style>
                        </div>
                    ) : plan ? (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="flex items-center justify-between">
                                <p className="font-jakarta font-bold text-brand-gold text-[12px] tracking-[0.2em] uppercase">YOUR 7-DAY WORKOUT PLAN</p>
                                <span className="font-jakarta text-[12px] text-gray-400 uppercase tracking-widest">{plan.focusArea} Focus</span>
                            </div>

                            {plan.days.map((day, idx) => (
                                <div key={idx} className="border border-black p-8 bg-white hover:border-brand-gold transition-colors duration-300 group">
                                    <div className="flex justify-between items-start mb-6">
                                        <p className="font-jakarta font-bold text-[11px] text-gray-400 tracking-[0.2em] uppercase">{day.day}</p>
                                        <span className={`px-3 py-1 text-[10px] font-jakarta font-bold tracking-widest uppercase ${day.isRest ? 'bg-brand-gold/10 text-brand-gold' : 'bg-black text-white'}`}>
                                            {day.isRest ? 'Rest Day' : day.type}
                                        </span>
                                    </div>

                                    <h3 className="font-playfair text-[28px] text-black mb-2">{day.workoutName}</h3>
                                    
                                    {!day.isRest ? (
                                        <>
                                            <p className="font-jakarta text-[13px] text-gray-500 mb-8">
                                                {day.duration} min  •  {day.caloriesBurned} kcal burned  •  {formData.fitnessLevel}
                                            </p>
                                            
                                            <div className="space-y-4">
                                                {day.exercises.map((ex, exIdx) => (
                                                    <div key={exIdx} className="flex justify-between items-center py-3 border-b border-gray-50 group-last:border-0">
                                                        <div>
                                                            <p className="font-jakarta font-semibold text-[14px] text-black mb-1">{ex.name}</p>
                                                            {ex.note && <p className="text-[11px] text-gray-400 font-jakarta">{ex.note}</p>}
                                                        </div>
                                                        <span className="font-jakarta text-[13px] text-gray-400">{ex.sets} sets × {ex.reps}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-8 flex items-start gap-3 p-4 bg-gray-50">
                                                <Info size={16} className="text-brand-gold mt-0.5" />
                                                <p className="font-jakarta text-[12px] italic text-gray-600">{day.tip}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-8">
                                            <p className="font-jakarta text-[14px] text-brand-gold italic mb-2">Active recovery — light stretching or a 20-min walk recommended.</p>
                                            <p className="font-jakarta text-[13px] text-gray-500">{day.tip}</p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Summary Card */}
                            <div className="border border-black p-10 bg-black text-white">
                                <p className="font-jakarta font-bold text-brand-gold text-[12px] tracking-[0.2em] uppercase mb-10">WEEKLY SUMMARY</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    {[
                                        { label: 'Total Workouts', val: plan.totalWorkouts },
                                        { label: 'Total Minutes', val: plan.totalMinutes },
                                        { label: 'Calories Burned', val: plan.totalCalories },
                                        { label: 'Focus Area', val: plan.focusArea }
                                    ].map((stat, i) => (
                                        <div key={i}>
                                            <p className="font-jakarta text-[11px] text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
                                            <p className="font-playfair text-[32px] text-white leading-none">{stat.val}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 pt-8 border-t border-white/10">
                                    <p className="font-jakarta italic text-[14px] text-gray-400 leading-relaxed">
                                        " {plan.advice} "
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={handleGenerate}
                                    className="flex-1 border border-black h-[56px] font-jakarta font-bold text-[13px] tracking-widest uppercase hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                                >
                                    <RefreshCw size={18} />
                                    Regenerate Plan
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="flex-1 bg-black text-white h-[56px] font-jakarta font-bold text-[13px] tracking-widest uppercase hover:bg-brand-gold transition-colors flex items-center justify-center gap-3"
                                >
                                    <Save size={18} />
                                    Save Plan
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center px-8">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Dumbbell className="text-gray-300" size={32} />
                            </div>
                            <h3 className="font-playfair text-[24px] text-black mb-3">No Plan Generated Yet</h3>
                            <p className="font-jakarta text-[14px] text-gray-400 max-w-sm">Use the form to create your personalized 7-day AI workout strategy.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkoutPlannerPage;
