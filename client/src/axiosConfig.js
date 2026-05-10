import axios from 'axios';

// In production (Vercel), API calls go to the Render backend URL via VITE_API_BASE_URL
// In development, Vite's proxy handles '/api' → localhost:5000
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

if (baseURL) {
    // Remove trailing slash if present
    const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    axios.defaults.baseURL = cleanBaseURL;
    console.log('Axios Base URL set to:', cleanBaseURL);
}

// Add a request interceptor for logging in development
axios.interceptors.request.use(config => {
    console.log(`🚀 ${config.method.toUpperCase()} request to: ${config.url}`);
    return config;
}, error => {
    return Promise.reject(error);
});

// Add a response interceptor to handle and log network errors specifically
axios.interceptors.response.use(
    response => response,
    error => {
        if (!error.response) {
            console.error('❌ NETWORK ERROR: Could not reach the server.');
            console.error('Possible causes: CORS policy mismatch, incorrect VITE_API_BASE_URL, or server is down.');
            console.error('Current Config baseURL:', axios.defaults.baseURL);
        } else {
            console.error(`❌ API ERROR (${error.response.status}):`, error.response.data.message || error.message);
        }
        return Promise.reject(error);
    }
);

export default axios;
