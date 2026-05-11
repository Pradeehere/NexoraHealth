import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, RefreshCw } from 'lucide-react';
import { useGetAirQualityQuery } from '../../features/airQuality/airQualityApi';

const AirQualityCard = () => {
    const [coords, setCoords] = useState({ lat: 12.9716, lon: 77.5946 }); // Default to Bangalore
    const [isGeoDenied, setIsGeoDenied] = useState(false);

    useEffect(() => {
        const getGeoLocation = () => {
            if (navigator.geolocation) {
                // Set a timeout for geolocation
                const timeoutId = setTimeout(() => {
                    console.log("Geolocation timed out, using default: Bangalore");
                    setIsGeoDenied(true);
                }, 5000);

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        clearTimeout(timeoutId);
                        setCoords({
                            lat: position.coords.latitude,
                            lon: position.coords.longitude
                        });
                        setIsGeoDenied(false);
                    },
                    (error) => {
                        clearTimeout(timeoutId);
                        console.error("Geolocation error:", error);
                        setIsGeoDenied(true);
                    },
                    { timeout: 5000 }
                );
            } else {
                setIsGeoDenied(true);
            }
        };

        getGeoLocation();
    }, []);

    const { data, isLoading, error, refetch } = useGetAirQualityQuery(coords);

    if (isLoading) {
        return (
            <div className="luxury-card p-6 h-full min-h-[300px] flex flex-col justify-center animate-pulse">
                <div className="h-4 bg-gray-200 w-1/3 mb-6"></div>
                <div className="h-24 bg-gray-200 w-1/2 mx-auto mb-6"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 w-full"></div>
                    <div className="h-4 bg-gray-200 w-full"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="luxury-card p-6 h-full flex flex-col items-center justify-center text-center">
                <AlertTriangle className="text-red-500 mb-4" size={40} />
                <h3 className="font-tenor text-sm uppercase tracking-widest mb-4">Unable to Fetch Air Data</h3>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors font-tenor text-xs uppercase"
                >
                    <RefreshCw size={14} /> Retry
                </button>
            </div>
        );
    }

    return (
        <div className="luxury-card p-6 relative flex flex-col h-full group">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-tenor text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em]">AIR QUALITY MONITOR</h3>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-jost uppercase tracking-wider mt-1">
                        <MapPin size={10} />
                        {data.location?.lat === 12.9716 ? "Bengaluru (Standard)" : "Live Location"}
                    </div>
                </div>
                {data.isMockData && <span className="text-[10px] text-orange-400 font-tenor italic tracking-widest">{data.cityName || 'Sample'} Data</span>}
            </div>

            {/* Main AQI */}
            <div className="flex flex-col items-center justify-center mb-8">
                <div
                    className="font-cormorant font-bold text-7xl leading-none transition-transform duration-500 group-hover:scale-110"
                    style={{ color: data.aqiColor }}
                >
                    {data.aqi}
                </div>
                <div className="font-tenor text-sm font-bold uppercase tracking-[0.25em] mt-3" style={{ color: data.aqiColor }}>
                    {data.aqiLevel}
                </div>
                <div className="w-full h-[1px] mt-2" style={{ backgroundColor: data.aqiColor, opacity: 0.3 }}></div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-0 border-y border-black/5 divide-x divide-black/5 mb-6">
                <div className="py-4 flex flex-col items-center">
                    <span className="text-[9px] text-gray-400 font-tenor tracking-widest uppercase">PM2.5</span>
                    <span className="font-jost font-bold text-sm">{data.pm25}<span className="text-[8px] font-normal ml-0.5">μg/m³</span></span>
                </div>
                <div className="py-4 flex flex-col items-center">
                    <span className="text-[9px] text-gray-400 font-tenor tracking-widest uppercase">PM10</span>
                    <span className="font-jost font-bold text-sm">{data.pm10}<span className="text-[8px] font-normal ml-0.5">μg/m³</span></span>
                </div>
                <div className="py-4 flex flex-col items-center">
                    <span className="text-[9px] text-gray-400 font-tenor tracking-widest uppercase">UV INDEX</span>
                    <span className="font-jost font-bold text-sm">{data.uvIndex} <span className="text-[8px] font-normal ml-0.5 capitalize">{data.uvIndex > 7 ? 'High' : data.uvIndex > 3 ? 'Mod' : 'Low'}</span></span>
                </div>
            </div>

            {/* Pollen Section */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-end">
                    <span className="font-tenor text-[10px] font-bold text-black uppercase tracking-widest">Pollen Levels</span>
                    <div className="flex items-center gap-1.5 ">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: data.aqiColor }}></div>
                        <span className="text-[9px] font-bold uppercase tracking-widest">{data.pollen.level}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    {[
                        { label: 'Birch', val: data.pollen.birch },
                        { label: 'Grass', val: data.pollen.grass },
                        { label: 'Olive', val: data.pollen.olive }
                    ].map(p => (
                        <div key={p.label} className="grid grid-cols-5 items-center gap-2">
                            <span className="col-span-1 text-[8px] font-tenor uppercase tracking-widest">{p.label}</span>
                            <div className="col-span-3 h-1 bg-gray-100 flex overflow-hidden">
                                <div
                                    className="h-full bg-brand-gold transition-all duration-1000"
                                    style={{ width: `${Math.min(p.val * 2, 100)}%` }}
                                ></div>
                            </div>
                            <span className="col-span-1 text-[8px] font-jost font-bold text-right">{p.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Warning Banner */}
            {data.warning && (
                <div className={`mt-auto p-3 flex gap-3 border-l-4 ${data.aqi > 80 ? 'bg-black text-white border-red-600' : 'bg-gray-50 text-red-900 border-red-500'}`}>
                    <AlertTriangle className="flex-shrink-0" size={14} />
                    <p className="text-[10px] font-jost leading-relaxed tracking-wide">
                        {data.warning}
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-center text-[8px] text-gray-400 font-jost uppercase tracking-[0.1em]">
                <span>Data from Open-Meteo</span>
                <span>Updated Just Now</span>
            </div>
        </div>
    );
};

export default AirQualityCard;
