import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const publicApi = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});

export default publicApi;