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
                <h1 className="text-4xl md:text-5xl font-jost font-medium text-black tracking-tight">
                    BMI Calculator
                </h1>
                <p className="font-jost text-sm text-gray-400 mt-2">Calculate your Body Mass Index and track it on your dashboard.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                {/* Input Card */}
                <div className="bg-white border border-black p-10 space-y-8">
                    <div className="flex items-center gap-3 pb-6 border-b border-black">
                        <Calculator className="text-black w-6 h-6" strokeWidth={1.5} />
                        <h2 className="font-jost font-semibold text-black text-xl tracking-wide">Enter Your Details</h2>
                    </div>

                    <div>
                        <label className="block font-jost text-xs text-gray-400 uppercase tracking-widest mb-3">Weight (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="e.g. 75"
                            className="w-full border-b-2 border-black px-0 py-3 font-jost text-3xl text-black focus:outline-none focus:border-brand-gold transition-colors bg-transparent"
                        />
                    </div>

                    <div>
                        <label className="block font-jost text-xs text-gray-400 uppercase tracking-widest mb-3">Height (cm)</label>
                        <input
                            type="number"
                            value={heightCm}
                            onChange={(e) => setHeightCm(e.target.value)}
                            placeholder="e.g. 173"
                            className="w-full border-b-2 border-black px-0 py-3 font-jost text-3xl text-black focus:outline-none focus:border-brand-gold transition-colors bg-transparent"
                        />
                    </div>

                    <button
                        onClick={handleCalculate}
                        className="w-full bg-black text-white font-jost uppercase tracking-widest text-sm py-5 hover:bg-brand-gold transition-colors flex items-center justify-center gap-3"
                    >
                        {saved ? (
                            <><CheckCircle size={20} /> Saved to Dashboard!</>
                        ) : (
                            <><Calculator size={20} /> Calculate My BMI</>
                        )}
                    </button>

                    <p className="text-xs text-gray-400 font-jost text-center leading-relaxed">
                        Your result will automatically update the BMI card on your Dashboard.
                    </p>
                </div>

                {/* Result Card */}
                <div className="flex flex-col gap-6">
                    {bmiResult ? (
                        <>
                            {/* Big Result */}
                            <div
                                className="border p-12 text-center flex-1 flex flex-col items-center justify-center transition-all duration-500"
                                style={{ borderColor: bmiResult.color, backgroundColor: bmiResult.bg }}
                            >
                                <div className="font-jost text-[100px] font-medium leading-none" style={{ color: bmiResult.color }}>
                                    {bmiResult.value}
                                </div>
                                <div className="font-tenor uppercase tracking-[0.3em] text-lg mt-4" style={{ color: bmiResult.color }}>
                                    {bmiResult.label}
                                </div>
                                <p className="font-jost text-sm text-gray-500 mt-4 max-w-xs">
                                    {bmiResult.value < 18.5 && "You're below the healthy range. Consider increasing caloric intake."}
                                    {bmiResult.value >= 18.5 && bmiResult.value < 25 && "Great! You're in the healthy BMI range. Keep it up!"}
                                    {bmiResult.value >= 25 && bmiResult.value < 30 && "Slightly above healthy range. Moderate exercise can help."}
                                    {bmiResult.value >= 30 && "Consider consulting a health professional for a personalized plan."}
                                </p>
                            </div>

                            {/* Scale */}
                            <div className="bg-white border border-black p-6">
                                <h3 className="font-jost text-xs uppercase tracking-widest text-gray-400 mb-4">BMI Scale</h3>
                                <div className="flex h-4 w-full overflow-hidden rounded-full">
                                    {zones.map((z) => (
                                        <div key={z.label} style={{ width: '25%', backgroundColor: z.color }} className="h-full" />
                                    ))}
                                </div>
                                {/* Indicator */}
                                <div className="relative w-full h-4 mt-1">
                                    <div
                                        className="absolute -top-1 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-700"
                                        style={{ left: `calc(${bmiPercent}% - 8px)`, backgroundColor: bmiResult.color }}
                                    />
                                </div>
                                <div className="flex justify-between mt-3">
                                    {zones.map((z) => (
                                        <div key={z.label} className="text-center" style={{ width: '25%' }}>
                                            <div className="font-jost text-[10px] text-gray-500">{z.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full border border-dashed border-gray-300 p-16 text-center bg-white">
                            <Calculator className="text-gray-200 w-24 h-24 mb-6" strokeWidth={0.6} />
                            <h3 className="font-jost font-medium text-gray-400 text-xl mb-2">No Result Yet</h3>
                            <p className="font-jost text-gray-400 text-sm leading-relaxed max-w-xs">
                                Enter your weight and height on the left, then tap Calculate to see your personalized BMI result.
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
