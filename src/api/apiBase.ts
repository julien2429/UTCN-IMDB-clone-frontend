import { useAuthStore } from '@/stores/auth';
import axios from 'axios';


const url = 'http://localhost:8080';

export const myApi = axios.create({
    baseURL: url
});


myApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

myApi.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response.status === 401) {
        
        useAuthStore().logout(); // Call the logout method from the store
        
    }
    return Promise.reject(error);
});
