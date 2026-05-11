import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Wind, MapPin, AlertTriangle, Droplets, Sun, Info } from 'lucide-react';

const AirQualityCard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchAirQuality = async (lat, lon) => {
        try {
            setLoading(true);
            setError(false);
            console.log('Fetching air quality for:', lat, lon);

            // Explicit token retrieval logic as requested
            const token = localStorage.getItem('token') ||
                JSON.parse(localStorage.getItem('user') || '{}').token ||
                '';

            const baseURL = import.meta.env.VITE_API_BASE_URL || '';
            const apiPath = baseURL ? `${baseURL}/api/air-quality` : '/api/air-quality';

            console.log('Using API Path:', apiPath);

            const response = await axios.get(
                `${apiPath}?lat=${lat}&lon=${lon}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 15000
                }
            );

            console.log('Air quality data received:', response.data);
            setData(response.data);
        } catch (err) {
            console.error('Air quality error:', err.message);
            // Show mock data instead of error
            setData({
                aqi: 35,
                aqiLevel: 'Fair',
                aqiColor: '#ffff00',
                pm25: 14,
                pm10: 24,
                uvIndex: 4,
                pollen: { birch: 6, grass: 9, olive: 4, level: 'Low' },
                warning: "Note: Live data unavailable. Using standard fallback profile.",
                isMockData: true,
                location: { lat, lon }
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getLocation = () => new Promise((resolve) => {
            if (!navigator.geolocation) {
                return resolve({ lat: 12.9716, lon: 77.5946 });
            }
            const timer = setTimeout(
                () => {
                    console.log("Geolocation timed out, using default: Bangalore");
                    resolve({ lat: 12.9716, lon: 77.5946 });
                },
                5000
            );
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    clearTimeout(timer);
                    resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                },
                () => {
                    clearTimeout(timer);
                    resolve({ lat: 12.9716, lon: 77.5946 });
                }
            );
        });

        getLocation().then(({ lat, lon }) => fetchAirQuality(lat, lon));
    }, []);

    if (loading) {
        return (
            <div className="bg-white border border-black p-8 animate-pulse h-full">
                <div className="h-4 w-32 bg-gray-200 mb-6"></div>
                <div className="h-24 w-full bg-gray-100"></div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="bg-white border border-black p-8 h-fit flex flex-col font-jost transition-all duration-500 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] border-b-2 border-b-brand-gold overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-tenor text-xl font-medium text-brand-gold uppercase tracking-[0.2em] mb-3">AIR QUALITY MONITOR</h3>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-jost uppercase tracking-wider mt-1">
                        <MapPin size={10} />
                        {data.location?.lat === 12.9716 ? "Bengaluru (Standard)" : "Live Location"}
                    </div>
                </div>
            </div>

            {/* Main AQI */}
            <div className="flex items-end gap-4 mb-8">
                <div className="text-7xl font-cormorant font-light flex items-start">
                    {Math.round(data.aqi)}
                    <span className="text-sm font-tenor text-gray-400 mt-4 ml-1">AQI</span>
                </div>
                <div className="pb-2">
                    <div
                        className="text-[10px] font-tenor font-bold uppercase tracking-widest px-2 py-0.5 border"
                        style={{ color: data.aqiColor, borderColor: data.aqiColor }}
                    >
                        {data.aqiLevel}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8 border-t border-black/5 pt-8">
                <div className="flex items-start gap-3">
                    <Wind size={16} className="text-gray-400 mt-1" />
                    <div>
                        <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">PM2.5</div>
                        <div className="font-cormorant text-xl">{data.pm25}<span className="text-[10px] text-gray-300 ml-1">µg/m³</span></div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Sun size={16} className="text-gray-400 mt-1" />
                    <div>
                        <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">UV INDEX</div>
                        <div className="font-cormorant text-xl uppercase">{data.uvIndex}</div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Droplets size={16} className="text-gray-400 mt-1" />
                    <div>
                        <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">POLLEN</div>
                        <div className="font-cormorant text-xl uppercase">{data.pollen.level}</div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Info size={16} className="text-gray-400 mt-1" />
                    <div>
                        <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">CITY</div>
                        <div className="font-cormorant text-xl uppercase">{data.location?.lat === 12.9716 ? 'BLR' : 'LOCAL'}</div>
                    </div>
                </div>
            </div>

            {/* Warning Message */}
            {data.warning && (
                <div className="bg-black text-[10px] text-white p-4 flex gap-3 mt-auto tracking-wide leading-relaxed font-tenor uppercase">
                    <AlertTriangle size={12} className="text-brand-gold shrink-0 mt-0.5" />
                    <span>{data.warning}</span>
                </div>
            )}
        </div>
    );
};

export default AirQualityCard;
