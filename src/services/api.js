import axios from 'axios';

console.log('Base url-', process.env.REACT_APP_API_BASE);
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE||'https://splitit-backend-i09x.onrender.com/api',
    withCredentials: true
})
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token) config.headers.Authorization= `Bearer ${token}`;
    return config;
})

export default api;