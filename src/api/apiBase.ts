import axios from 'axios';

const url = 'http://localhost:8080';

export const myApi = axios.create({
    baseURL: url
});
