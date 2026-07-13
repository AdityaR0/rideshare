// client/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Automatically attach token to every request
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    const token = localStorage.getItem("carpool-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
