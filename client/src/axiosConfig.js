import axios from 'axios';

// In production (Vercel), API calls go to the Render backend URL via VITE_API_BASE_URL
// In development, Vite's proxy handles '/api' → localhost:5000
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

if (baseURL) {
    axios.defaults.baseURL = baseURL;
}

export default axios;
