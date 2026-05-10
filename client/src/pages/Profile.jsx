import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, Calculator, CheckCircle } from 'lucide-react';
import { logout, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6', bg: '#eff6ff' };
    if (bmi < 25) return { label: 'Normal Weight', color: '#16a34a', bg: '#f0fdf4' };
    if (bmi < 30) return { label: 'Overweight', color: '#d97706', bg: '#fffbeb' };
    return { label: 'Obese', color: '#dc2626', bg: '#fef2f2' };
};

const Profile = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [weight, setWeight] = useState(user?.weight?.toString() || '');
    const [heightCm, setHeightCm] = useState(user?.height?.toString() || '');
    const [bmiResult, setBmiResult] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load previously saved BMI
        const stored = localStorage.getItem('nexora_bmi');
        if (stored) setBmiResult(JSON.parse(stored));
    }, []);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    const handleCalculate = () => {
        const w = parseFloat(weight);
        const h = parseFloat(heightCm) / 100;
        if (!w || !h || h === 0) return;
        const val = parseFloat((w / (h * h)).toFixed(1));
        const cat = getBMICategory(val);
        const result = { value: val, ...cat };
        setBmiResult(result);
        // Sync to localStorage so the Dashboard reads it
        localStorage.setItem('nexora_bmi', JSON.stringify(result));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('') : '?';
    const bmiPercent = bmiResult ? Math.min(((bmiResult.value - 10) / 30) * 100, 100) : 0;

    const zones = [
        { label: 'Under', color: '#3b82f6', width: '25%' },
        { label: 'Normal', color: '#16a34a', width: '25%' },
        { label: 'Over', color: '#d97706', width: '25%' },
        { label: 'Obese', color: '#dc2626', width: '25%' },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up pb-16">
            <header className="bg-white border-b border-black pb-4">
                <h1 className="text-4xl md:text-5xl font-jost font-medium text-black tracking-tight">
                    User Profile
                </h1>
            </header>

            {/* Profile Card */}
            <div className="bg-white border border-black p-10 flex flex-col md:flex-row gap-12 items-center md:items-start max-w-4xl mx-auto">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 bg-black flex items-center justify-center text-5xl font-cormorant font-bold text-white border border-brand-gold p-1">
                        <div className="w-full h-full border border-brand-gold flex items-center justify-center rounded-sm">
                            {initials}
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-8 text-center md:text-left font-jost w-full">
                    <div>
                        <h2 className="text-4xl font-cormorant font-bold text-black uppercase tracking-wide">{user?.name}</h2>
                        <p className="text-[#555] font-tenor text-sm tracking-widest mt-2">{user?.email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-black">
                        <div>
                            <span className="font-tenor uppercase tracking-[0.2em] text-xs text-brand-gold block mb-2">Role</span>
                            <span className="capitalize font-bold text-lg">{user?.role}</span>
                        </div>
                        <div>
                            <span className="font-tenor uppercase tracking-[0.2em] text-xs text-brand-gold block mb-2">Height</span>
                            <span className="font-bold text-lg">{user?.height || 'N/A'} cm</span>
                        </div>
                        <div>
                            <span className="font-tenor uppercase tracking-[0.2em] text-xs text-brand-gold block mb-2">Weight</span>
                            <span className="font-bold text-lg">{user?.weight || 'N/A'} kg</span>
                        </div>
                        <div>
                            <span className="font-tenor uppercase tracking-[0.2em] text-xs text-brand-gold block mb-2">Age</span>
                            <span className="font-bold text-lg">{user?.age || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="pt-8 flex justify-center md:justify-start">
                        <button onClick={onLogout} className="flex items-center gap-4 border border-black text-black px-10 py-3 hover:bg-black hover:text-white transition-colors font-tenor uppercase tracking-widest text-xs">
                            <LogOut size={16} strokeWidth={1} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* BMI Calculator Section */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white border border-black p-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-black">
                        <Calculator className="text-black w-6 h-6" strokeWidth={1.5} />
                        <h2 className="font-jost font-semibold text-black text-2xl tracking-wide">BMI Calculator</h2>
                        <span className="ml-auto font-jost text-xs text-gray-400 uppercase tracking-widest">Body Mass Index</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Inputs */}
                        <div className="space-y-6">
                            <div>
                                <label className="block font-jost text-xs text-gray-500 uppercase tracking-widest mb-2">Weight (kg)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="e.g. 75"
                                    className="w-full border-b-2 border-black px-0 py-3 font-jost text-xl text-black focus:outline-none focus:border-brand-gold transition-colors bg-transparent"
                                />
                            </div>
                            <div>
                                <label className="block font-jost text-xs text-gray-500 uppercase tracking-widest mb-2">Height (cm)</label>
                                <input
                                    type="number"
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(e.target.value)}
                                    placeholder="e.g. 173"
                                    className="w-full border-b-2 border-black px-0 py-3 font-jost text-xl text-black focus:outline-none focus:border-brand-gold transition-colors bg-transparent"
                                />
                            </div>
                            <button
                                onClick={handleCalculate}
                                className="w-full bg-black text-white font-jost uppercase tracking-widest text-sm py-4 hover:bg-brand-gold transition-colors flex items-center justify-center gap-3 mt-4"
                            >
                                {saved ? (
                                    <><CheckCircle size={18} /> Saved to Dashboard</>
                                ) : (
                                    <><Calculator size={18} /> Calculate BMI</>
                                )}
                            </button>
                            <p className="text-xs text-gray-400 font-jost text-center">Result will auto-update your Dashboard BMI card.</p>
                        </div>

                        {/* Result */}
                        <div className="flex flex-col justify-center">
                            {bmiResult ? (
                                <div className="space-y-6">
                                    <div
                                        className="p-8 border text-center transition-all duration-500"
                                        style={{ borderColor: bmiResult.color, backgroundColor: bmiResult.bg }}
                                    >
                                        <div className="font-jost text-[72px] font-medium leading-none" style={{ color: bmiResult.color }}>
                                            {bmiResult.value}
                                        </div>
                                        <div className="font-tenor uppercase tracking-widest text-sm mt-3" style={{ color: bmiResult.color }}>
                                            {bmiResult.label}
                                        </div>
                                    </div>

                                    {/* BMI Scale Bar */}
                                    <div>
                                        <div className="flex h-3 w-full overflow-hidden rounded-full">
                                            {zones.map((z) => (
                                                <div key={z.label} style={{ width: z.width, backgroundColor: z.color }} className="h-full" />
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-1 text-[10px] font-jost text-gray-400">
                                            <span>Under &lt;18.5</span>
                                            <span>Normal 18.5–24.9</span>
                                            <span>Over 25–29.9</span>
                                            <span>Obese 30+</span>
                                        </div>
                                        {/* Indicator */}
                                        <div className="relative w-full h-2 mt-1">
                                            <div
                                                className="absolute -top-1 w-3 h-3 rounded-full border-2 border-white shadow-md transition-all duration-700"
                                                style={{ left: `${bmiPercent}%`, backgroundColor: bmiResult.color }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full border border-dashed border-gray-300 p-10 text-center">
                                    <Calculator className="text-gray-300 w-16 h-16 mb-4" strokeWidth={0.8} />
                                    <p className="font-jost text-gray-400 text-sm">Enter your weight and height, then calculate to see your BMI result here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
