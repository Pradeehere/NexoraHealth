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
    try {
        const lat = req.query.lat || 12.9716;
        const lon = req.query.lon || 77.5946;

        console.log(`[AirQuality] Fetching data for Lat: ${lat}, Lon: ${lon}`);

        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5,pm10,uv_index,pollen_birch,pollen_grass,pollen_olive&timezone=auto`;

        const response = await axios.get(url);

        if (!response.data || !response.data.current) {
            throw new Error("Invalid response from Open-Meteo");
        }

        const data = response.data.current;

        const { level: aqiLevel, color: aqiColor } = getAQILevel(data.european_aqi);
        const pollenLevel = getPollenLevel(data.pollen_birch, data.pollen_grass, data.pollen_olive);

        // Warning logic
        let warning = null;
        if (data.european_aqi > 60 || pollenLevel === "High" || pollenLevel === "Very High") {
            warning = "Poor air quality or high pollen detected. People with asthma or respiratory issues should limit outdoor activities.";
        }
        if (data.uv_index > 7) {
            warning = warning ? `${warning} High UV index detected, skin protection recommended.` : "High UV index detected. Wear sunscreen and limit direct sun exposure.";
        }

        res.json({
            aqi: data.european_aqi,
            aqiLevel,
            aqiColor,
            pm25: data.pm2_5,
            pm10: data.pm10,
            uvIndex: data.uv_index,
            pollen: {
                birch: data.pollen_birch,
                grass: data.pollen_grass,
                olive: data.pollen_olive,
                level: pollenLevel
            },
            warning,
            location: { lat, lon },
            isMockData: false
        });
    } catch (error) {
        console.error('Air Quality API Failure - Returning Mock Data:', error.message);
        // Return structured mock data so app never crashes
        res.json({
            aqi: 32,
            aqiLevel: "Fair",
            aqiColor: "#ffff00",
            pm25: 12,
            pm10: 22,
            uvIndex: 5,
            pollen: {
                birch: 5,
                grass: 8,
                olive: 3,
                level: "Low"
            },
            warning: "Note: Displaying sample air quality data due to external API connectivity issues.",
            location: { lat: 12.9716, lon: 77.5946 },
            isMockData: true
        });
    }
};

module.exports = {
    getAirQuality
};
