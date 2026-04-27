import axios from 'axios';

const BASE_URL = process.env.GATSBY_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;
