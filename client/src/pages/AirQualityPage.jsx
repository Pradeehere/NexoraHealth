import React, { useState, useEffect } from 'react';
import { useGetAirQualityQuery } from '../features/airQuality/airQualityApi';
import { MapPin, Info, RefreshCw, CheckCircle2, AlertCircle, Ban } from 'lucide-react';

const AirQualityPage = () => {
    const [coords, setCoords] = useState({ lat: 12.9716, lon: 77.5946 });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => setCoords({ lat: position.coords.latitude, lon: position.coords.longitude }),
                (err) => console.log("Geo error", err)
            );
        }
    }, []);

    const { data, isLoading, isError, refetch, isFetching } = useGetAirQualityQuery(coords);

    if (isLoading) return <div className="p-8 font-tenor uppercase tracking-widest text-center">Curating Air Data...</div>;
    if (isError || !data) return <div className="p-8 text-center">Unable to load air quality details.</div>;

    const recommendations = (() => {
        switch (data.aqiLevel) {
            case 'Good': return ["Great day for outdoor exercise!", "Ideal time for outdoor gardening", "Ventilate your home with fresh air", "Enjoy a walk in the park"];
            case 'Fair': return ["Sensitive groups should limit prolonged outdoor exertion", "Good day for most outdoor activities", "Consider outdoor activities in the morning", "Clean air filters if you have them"];
            case 'Moderate': return ["Consider wearing a mask outdoors", "Sensitive groups should avoid heavy outdoor work", "Keep windows closed during peak traffic", "Monitor air quality regularly"];
            case 'Poor': return ["Avoid outdoor activities if you have asthma or respiratory issues", "Wearing an N95 mask is highly recommended", "Minimize all outdoor physical exertion", "Use air purifiers indoors"];
            case 'Very Poor': return ["Stay indoors. Keep windows closed.", "Avoid all outdoor physical activity", "Run air purifiers on high setting", "Use a mask even for short trips outside"];
            case 'Extremely Poor': return ["Do not go outside.", "Seek medical advice if experiencing symptoms", "Maintain strictly closed indoor environment", "Emergency respiratory protection required"];
            default: return ["Awaiting more data..."];
        }
    })();

    const dashArray = 283; // 2 * PI * 45
    const dashOffset = dashArray - (dashArray * Math.min(data.aqi, 100)) / 100;

    return (
        <div className="space-y-12 animate-fade-in-up pb-24 max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black pb-8">
                <div>
                    <h1 className="text-5xl font-cormorant italic font-bold tracking-tight uppercase">Air Quality Monitor</h1>
                    <div className="flex items-center gap-2 mt-4 text-gray-500 font-tenor text-xs tracking-widest">
                        <MapPin size={14} className="text-brand-gold" />
                        <span>Detecting Atmosphere: {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}</span>
                    </div>
                </div>
                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="flex items-center gap-3 border border-black px-8 py-3 hover:bg-black hover:text-white transition-all font-tenor uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                >
                    <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
                    {isFetching ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Main Gauge */}
                <div className="luxury-card p-12 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <Info size={20} className="text-gray-200" />
                    </div>

                    <div className="relative w-72 h-72">
                        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                            {/* Background Circle */}
                            <circle
                                cx="50" cy="50" r="45"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="transparent"
                                className="text-gray-100"
                            />
                            {/* Main Gauge Progress */}
                            <circle
                                cx="50" cy="50" r="45"
                                stroke={data.aqiColor}
                                strokeWidth="4"
                                strokeDasharray={dashArray}
                                strokeDashoffset={dashOffset}
                                strokeLinecap="round"
                                fill="transparent"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-cormorant text-8xl font-bold transition-all duration-500" style={{ color: data.aqiColor }}>
                                {data.aqi}
                            </span>
                            <span className="font-tenor text-sm font-bold tracking-[0.3em] uppercase mt-2" style={{ color: data.aqiColor }}>
                                {data.aqiLevel}
                            </span>
                        </div>
                    </div>

                    <div className="mt-12 text-center max-w-sm">
                        <p className="font-jost text-gray-600 leading-relaxed italic">
                            "The air quality in your current sector is classified as <span className="font-bold underline" style={{ color: data.aqiColor }}>{data.aqiLevel}</span>.
                            {data.aqi > 60 ? ' We recommend staying indoors for optimal respiratory health.' : ' It is a pristine time for outdoor activities.'}"
                        </p>
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-8">
                    <h3 className="section-heading !text-3xl mb-0">Atmos Breakdown</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'PM2.5', value: data.pm25, unit: 'μg/m³', desc: 'Fine particles' },
                            { label: 'PM10', value: data.pm10, unit: 'μg/m³', desc: 'Inhalable particles' },
                            { label: 'UV Index', value: data.uvIndex, unit: 'Level', desc: 'Solar radiation' }
                        ].map((stat) => (
                            <div key={stat.label} className="luxury-card p-6 flex flex-col">
                                <span className="font-tenor text-[10px] text-gray-400 tracking-widest uppercase mb-4">{stat.label}</span>
                                <span className="font-cormorant text-4xl font-bold border-b border-brand-gold/30 pb-2 mb-2">{stat.value}<span className="text-xs ml-1 font-normal text-gray-500">{stat.unit}</span></span>
                                <span className="text-[10px] text-gray-400 font-jost uppercase italic">{stat.desc}</span>
                            </div>
                        ))}
                    </div>

                    <div className="luxury-card p-8">
                        <div className="flex justify-between items-center mb-8 border-b border-black pb-4">
                            <h4 className="font-tenor font-bold text-sm tracking-[0.2em] uppercase">Detailed Pollen Outlook</h4>
                            <span className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${data.pollen.level === 'Low' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                {data.pollen.level} Intensity
                            </span>
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: 'Birch Pollen Count', val: data.pollen.birch, color: '#C9A84C' },
                                { label: 'Grass Pollen Count', val: data.pollen.grass, color: '#C9A84C' },
                                { label: 'Olive Pollen Count', val: data.pollen.olive, color: '#C9A84C' }
                            ].map(item => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex justify-between font-tenor text-[10px] uppercase tracking-widest">
                                        <span>{item.label}</span>
                                        <span>{item.val} Grains/m³</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 w-full overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-1000"
                                            style={{ width: `${Math.min(item.val * 2.5, 100)}%`, backgroundColor: item.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Health Recommendations */}
            <div className="bg-black text-white p-12">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-[2px] w-12 bg-brand-gold"></div>
                    <h3 className="font-tenor text-lg tracking-[0.3em] uppercase">Nexora Wellness Protocols</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-4 group">
                            <CheckCircle2 size={24} className="text-brand-gold shrink-0 group-hover:scale-125 transition-transform" />
                            <p className="font-jost text-sm leading-relaxed text-gray-300">
                                {rec}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="pt-8 border-t border-black flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-tenor text-gray-400 tracking-widest uppercase">
                <div className="flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>Atmospheric data synchronized with Open-Meteo European AQI standard</span>
                </div>
                <div>
                    Updated: {new Date().toLocaleTimeString()}
                </div>
            </footer>
        </div>
    );
};

export default AirQualityPage;
