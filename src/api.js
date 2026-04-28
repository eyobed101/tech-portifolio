import axios from 'axios';

const BASE_URL = process.env.GATSBY_API_URL || 'http://localhost:3001';

console.log('API Base URL:', BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;
