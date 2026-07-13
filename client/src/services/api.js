// client/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://rideshare-api-xh6a.onrender.com/api",
});

// ✅ Automatically attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("carpool-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
