const axios = require('axios');

// AQI Level Mapping (European AQI)
const getAQILevel = (aqi) => {
    if (aqi <= 20) return { level: "Good", color: "#00e400" };
    if (aqi <= 40) return { level: "Fair", color: "#ffff00" };
    if (aqi <= 60) return { level: "Moderate", color: "#ff7e00" };
    if (aqi <= 80) return { level: "Poor", color: "#ff0000" };
    if (aqi <= 100) return { level: "Very Poor", color: "#8f3f97" };
    return { level: "Extremely Poor", color: "#7e0023" };
};

// Pollen Level Mapping
const getPollenLevel = (birch, grass, olive) => {
    const maxPollen = Math.max(birch, grass, olive);
    if (maxPollen <= 10) return "Low";
    if (maxPollen <= 25) return "Moderate";
    if (maxPollen <= 50) return "High";
    return "Very High";
};

// @desc    Get Air Quality and Pollen data
// @route   GET /api/air-quality
// @access  Private
const getAirQuality = async (req, res) => {
    const lat = req.query.lat || 12.9716;
    const lon = req.query.lon || 77.5946;

    console.log('=== AIR QUALITY CONTROLLER HIT ===');
    console.log('lat:', lat, 'lon:', lon);

    try {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5,pm10,uv_index,pollen_birch,pollen_grass,pollen_olive&timezone=auto`;
        console.log('Fetching URL:', url);

        const axios = require('axios');
        const response = await axios.get(url, { timeout: 8000 });
        console.log('Open-Meteo response:', JSON.stringify(response.data));

        const current = response.data.current || {};
        const aqi = current.european_aqi || 0;

        // AQI level mapping
        let aqiLevel = 'Good';
        let aqiColor = '#00e400';
        if (aqi > 20) { aqiLevel = 'Fair'; aqiColor = '#ffff00'; }
        if (aqi > 40) { aqiLevel = 'Moderate'; aqiColor = '#ff7e00'; }
        if (aqi > 60) { aqiLevel = 'Poor'; aqiColor = '#ff0000'; }
        if (aqi > 80) { aqiLevel = 'Very Poor'; aqiColor = '#8f3f97'; }
        if (aqi > 100) { aqiLevel = 'Extremely Poor'; aqiColor = '#7e0023'; }

        const birch = current.pollen_birch || 0;
        const grass = current.pollen_grass || 0;
        const olive = current.pollen_olive || 0;
        const maxPollen = Math.max(birch, grass, olive);
        let pollenLevel = 'Low';
        if (maxPollen > 10) pollenLevel = 'Moderate';
        if (maxPollen > 25) pollenLevel = 'High';
        if (maxPollen > 50) pollenLevel = 'Very High';

        let warning = null;
        if (aqi > 60) warning = 'Poor air quality detected. People with asthma or respiratory issues should avoid outdoor activities.';
        if (maxPollen > 25) warning = (warning ? warning + ' ' : '') + 'High pollen levels detected. Allergy sufferers should take precautions.';

        const result = {
            aqi,
            aqiLevel,
            aqiColor,
            pm25: current.pm2_5 || 0,
            pm10: current.pm10 || 0,
            uvIndex: current.uv_index || 0,
            pollen: { birch, grass, olive, level: pollenLevel },
            warning,
            location: { lat, lon },
            isMockData: false
        };

        console.log('Sending result:', JSON.stringify(result));
        return res.status(200).json(result);

    } catch (error) {
        console.error('Air quality fetch error:', error.message);
        console.error('Full error:', error);

        // ALWAYS return 200 with mock data — never crash
        return res.status(200).json({
            aqi: 35,
            aqiLevel: 'Fair',
            aqiColor: '#ffff00',
            pm25: 14,
            pm10: 24,
            uvIndex: 4,
            pollen: { birch: 6, grass: 9, olive: 4, level: 'Low' },
            warning: null,
            location: { lat, lon },
            isMockData: true
        });
    }
};

module.exports = {
    getAirQuality
};
