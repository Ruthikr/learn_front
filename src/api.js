import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "https://aa51-2401-4900-62e0-6b3f-4c6a-368a-bf33-39e.ngrok-free.app/";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
