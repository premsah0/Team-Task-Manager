import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api'
});

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const parsedInfo = JSON.parse(userInfo);
        if (parsedInfo.token) {
            config.headers.Authorization = `Bearer ${parsedInfo.token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
