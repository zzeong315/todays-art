import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const privateApi = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});

// 요청 인터셉터 - 토큰 자동 추가
privateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('token', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
privateApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 401 처리 등
    return Promise.reject(error);
  }
);

export default privateApi;
