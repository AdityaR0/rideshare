import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "https://ridesare-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 REQUEST INTERCEPTOR – attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("carpool-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🚨 RESPONSE INTERCEPTOR – handle auth errors globally (OPTIONAL but STRONG)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // token expired / invalid
      localStorage.removeItem("carpool-user");
      localStorage.removeItem("carpool-token");

      // optional redirect
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
