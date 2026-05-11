import React, { useState, useEffect } from 'react';
import { Calculator, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6', bg: '#eff6ff' };
    if (bmi < 25) return { label: 'Normal Weight', color: '#16a34a', bg: '#f0fdf4' };
    if (bmi < 30) return { label: 'Overweight', color: '#d97706', bg: '#fffbeb' };
    return { label: 'Obese', color: '#dc2626', bg: '#fef2f2' };
};

const zones = [
    { label: 'Under <18.5', color: '#3b82f6' },
    { label: 'Normal 18.5–24.9', color: '#16a34a' },
    { label: 'Over 25–29.9', color: '#d97706' },
    { label: 'Obese 30+', color: '#dc2626' },
];

const BMIPage = () => {
    const { user } = useSelector(state => state.auth);

    const [weight, setWeight] = useState(user?.weight?.toString() || '');
    const [heightCm, setHeightCm] = useState(user?.height?.toString() || '');
    const [bmiResult, setBmiResult] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('nexora_bmi');
        if (stored) setBmiResult(JSON.parse(stored));
    }, []);

    const handleCalculate = () => {
        const w = parseFloat(weight);
        const h = parseFloat(heightCm) / 100;
        if (!w || !h || h === 0) return;
        const val = parseFloat((w / (h * h)).toFixed(1));
        const cat = getBMICategory(val);
        const result = { value: val, ...cat };
        setBmiResult(result);
        localStorage.setItem('nexora_bmi', JSON.stringify(result));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const bmiPercent = bmiResult ? Math.min(((bmiResult.value - 10) / 30) * 100, 100) : 0;

    return (
        <div className="space-y-8 animate-fade-in-up pb-16">
            <header className="bg-white border-b border-black pb-4">
                <h1 className="text-4xl md:text-5xl font-cormorant font-medium text-black tracking-tight uppercase">
                    BMI Calculator
                </h1>
                <div className="h-[2px] w-24 bg-brand-gold mt-2"></div>
                <p className="font-tenor text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-4">Calculate your personal metrics</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                {/* Input Card */}
                <div className="luxury-card p-10 space-y-8">
                    <div className="flex items-center gap-3 pb-6 border-b border-black/10">
                        <Calculator className="text-black w-5 h-5" strokeWidth={1} />
                        <h2 className="font-tenor font-bold text-xs text-black uppercase tracking-[0.2em]">Personal Data</h2>
                    </div>

                    <div>
                        <label className="block font-tenor text-[10px] text-gray-400 uppercase tracking-widest mb-3 italic">Weight (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="75"
                            className="w-full border-b-2 border-black px-0 py-3 font-cormorant font-bold text-4xl text-black focus:outline-none focus:border-brand-gold transition-colors bg-transparent placeholder:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block font-tenor text-[10px] text-gray-400 uppercase tracking-widest mb-3 italic">Height (cm)</label>
                        <input
                            type="number"
                            value={heightCm}
                            onChange={(e) => setHeightCm(e.target.value)}
                            placeholder="173"
                            className="w-full border-b-2 border-black px-0 py-3 font-cormorant font-bold text-4xl text-black focus:outline-none focus:border-brand-gold transition-colors bg-transparent placeholder:text-gray-100"
                        />
                    </div>

                    <button
                        onClick={handleCalculate}
                        className="w-full bg-black text-white font-tenor uppercase tracking-[0.3em] text-xs py-6 hover:bg-brand-gold transition-all duration-300 flex items-center justify-center gap-3 group"
                    >
                        {saved ? (
                            <><CheckCircle size={18} className="text-white" /> SAVED TO DATABASE</>
                        ) : (
                            <><Calculator size={18} className="group-hover:rotate-12 transition-transform" /> ANALYZE METRICS</>
                        )}
                    </button>

                    <p className="text-[10px] text-gray-400 font-tenor text-center tracking-widest uppercase opacity-60">
                        Your result will automatically synchronize with your Dashboard.
                    </p>
                </div>

                {/* Result Card */}
                <div className="flex flex-col gap-6">
                    {bmiResult ? (
                        <>
                            {/* Big Result */}
                            <div
                                className="luxury-card p-12 text-center flex-1 flex flex-col items-center justify-center transition-all duration-500 bg-white"
                                style={{ borderLeft: `8px solid ${bmiResult.color}` }}
                            >
                                <div className="font-cormorant text-[120px] font-bold leading-none" style={{ color: bmiResult.color }}>
                                    {bmiResult.value}
                                </div>
                                <div className="font-tenor uppercase tracking-[0.4em] text-sm font-bold mt-4" style={{ color: bmiResult.color }}>
                                    {bmiResult.label}
                                </div>
                                <p className="font-jost text-sm text-gray-500 mt-8 max-w-xs leading-relaxed italic border-t border-black/5 pt-6">
                                    {bmiResult.value < 18.5 && "Sector: Underweight. Strategic caloric surplus recommended."}
                                    {bmiResult.value >= 18.5 && bmiResult.value < 25 && "Sector: Optimal. Your biometric profile is maintained flawlessly."}
                                    {bmiResult.value >= 25 && bmiResult.value < 30 && "Sector: Elevated. Precision physical training advised."}
                                    {bmiResult.value >= 30 && "Sector: Critical. Urgent wellness intervention recommended."}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="luxury-card flex flex-col items-center justify-center h-full border-dashed border-gray-200 p-16 text-center bg-gray-50/30">
                            <Calculator className="text-gray-200 w-24 h-24 mb-6" strokeWidth={0.5} />
                            <h3 className="font-tenor font-bold text-gray-400 text-xs tracking-widest uppercase mb-4">Awaiting Calculation</h3>
                            <p className="font-jost text-gray-400 text-xs italic leading-relaxed max-w-xs">
                                Input your current statistics to generate a comprehensive Body Mass Index analysis.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reference Table */}
            <div className="bg-white border border-black p-8 max-w-xl">
                <h3 className="font-jost font-semibold text-black text-lg mb-6 uppercase tracking-wide">BMI Reference Guide</h3>
                <div className="divide-y divide-gray-100">
                    {[
                        { range: 'Below 18.5', category: 'Underweight', color: '#3b82f6' },
                        { range: '18.5 – 24.9', category: 'Normal Weight', color: '#16a34a' },
                        { range: '25.0 – 29.9', category: 'Overweight', color: '#d97706' },
                        { range: '30.0 and above', category: 'Obese', color: '#dc2626' },
                    ].map((row) => (
                        <div key={row.category} className="py-4 flex justify-between items-center">
                            <span className="font-jost text-sm text-gray-500">{row.range}</span>
                            <span className="font-jost text-sm font-semibold" style={{ color: row.color }}>{row.category}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BMIPage;
