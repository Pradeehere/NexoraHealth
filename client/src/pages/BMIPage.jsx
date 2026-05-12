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
        <div className="space-y-8 animate-fade-in-up pb-16 max-w-[1200px] mx-auto p-8">
            <header className="bg-white border-b border-black pb-8">
                <p className="font-inter font-bold text-[12px] text-brand-gold tracking-[0.2em] uppercase mb-3">BIOMETRIC ANALYSIS</p>
                <h1 className="text-4xl md:text-[48px] font-cormorant font-medium text-black tracking-tight italic">
                    BMI Calculator
                </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
                {/* Input Card */}
                <div className="border border-black p-10 space-y-10 bg-white">
                    <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                        <Calculator className="text-brand-gold w-5 h-5" strokeWidth={1.5} />
                        <h2 className="font-inter font-bold text-[12px] text-black uppercase tracking-[0.15em]">Personal Metrics</h2>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="block font-inter font-bold text-[11px] text-gray-400 uppercase tracking-widest mb-3">Weight (kg)</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="75"
                                className="w-full border-b border-black px-0 py-4 font-cormorant font-bold text-4xl text-black focus:outline-none focus:border-brand-gold transition-colors bg-transparent placeholder:text-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block font-inter font-bold text-[11px] text-gray-400 uppercase tracking-widest mb-3">Height (cm)</label>
                            <input
                                type="number"
                                value={heightCm}
                                onChange={(e) => setHeightCm(e.target.value)}
                                placeholder="173"
                                className="w-full border-b border-black px-0 py-4 font-cormorant font-bold text-4xl text-black focus:outline-none focus:border-brand-gold transition-colors bg-transparent placeholder:text-gray-100"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleCalculate}
                        className="w-full bg-black text-white font-inter font-bold uppercase tracking-[0.2em] text-[13px] py-6 hover:bg-brand-gold transition-all duration-300 flex items-center justify-center gap-3 group"
                    >
                        {saved ? (
                            <><CheckCircle size={18} className="text-white" /> METRICS UPDATED</>
                        ) : (
                            <><Calculator size={18} className="group-hover:rotate-12 transition-transform" /> ANALYZE BMI</>
                        )}
                    </button>

                    <p className="text-[11px] text-gray-400 font-inter text-center tracking-widest uppercase italic">
                        Precision calculated based on World Health Organization standards.
                    </p>
                </div>

                {/* Result Card */}
                <div className="flex flex-col gap-6">
                    {bmiResult ? (
                        <>
                            {/* Big Result */}
                            <div
                                className="border border-black p-12 text-center flex-1 flex flex-col items-center justify-center transition-all duration-500 bg-white"
                                style={{ borderLeft: `8px solid ${bmiResult.color}` }}
                            >
                                <div className="font-cormorant text-[100px] font-bold leading-none mb-4" style={{ color: bmiResult.color }}>
                                    {bmiResult.value}
                                </div>
                                <div className="font-inter uppercase tracking-[0.3em] text-[14px] font-bold py-2 px-6 border border-current mb-8" style={{ color: bmiResult.color }}>
                                    {bmiResult.label}
                                </div>
                                <p className="font-inter text-[15px] text-gray-600 max-w-xs leading-relaxed italic border-t border-gray-50 pt-8">
                                    {bmiResult.value < 18.5 && "Strategy: Caloric surplus and nutrient-dense intake recommended."}
                                    {bmiResult.value >= 18.5 && bmiResult.value < 25 && "Strategy: Maintenance. Your biometric profile is optimal."}
                                    {bmiResult.value >= 25 && bmiResult.value < 30 && "Strategy: Balanced caloric deficit and precision cardio advised."}
                                    {bmiResult.value >= 30 && "Strategy: High-intensity wellness intervention recommended."}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="border border-dashed border-gray-200 flex flex-col items-center justify-center h-full p-16 text-center bg-gray-50/30">
                            <Calculator className="text-gray-200 w-24 h-24 mb-6" strokeWidth={0.5} />
                            <h3 className="font-inter font-bold text-gray-400 text-[11px] tracking-widest uppercase mb-4">Awaiting Input</h3>
                            <p className="font-inter text-gray-400 text-[13px] italic leading-relaxed max-w-xs">
                                Input your current statistics to generate a comprehensive Body Mass Index analysis.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reference Table */}
            <div className="bg-white border border-black p-10 max-w-xl">
                <h3 className="font-inter font-bold text-black text-[12px] mb-8 uppercase tracking-[0.2em] text-brand-gold">BMI REFERENCE GUIDE</h3>
                <div className="space-y-6">
                    {[
                        { range: 'Below 18.5', category: 'Underweight', color: '#3b82f6' },
                        { range: '18.5 – 24.9', category: 'Normal Weight', color: '#16a34a' },
                        { range: '25.0 – 29.9', category: 'Overweight', color: '#d97706' },
                        { range: '30.0 and above', category: 'Obese', color: '#dc2626' },
                    ].map((row) => (
                        <div key={row.category} className="flex justify-between items-center border-b border-gray-50 pb-4">
                            <span className="font-inter text-[14px] text-gray-500">{row.range}</span>
                            <span className="font-inter text-[13px] font-bold uppercase tracking-wider" style={{ color: row.color }}>{row.category}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default BMIPage;
