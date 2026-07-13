import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ Load user on app refresh
  useEffect(() => {
    const token = localStorage.getItem("carpool-token");
    const savedUser = localStorage.getItem("carpool-user");

    if (token && savedUser) {
      setUser({ ...JSON.parse(savedUser), token });
    }

    setLoadingUser(false);
  }, []);

  // ✅ LOGIN (TOKEN ONLY → FETCH USER FROM BACKEND)
  const login = async ({ token }) => {
    localStorage.setItem("carpool-token", token);

    try {
      const res = await api.get("/users/me");

      setUser({ ...res.data, token });
      localStorage.setItem("carpool-user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to fetch user after login");
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("carpool-user");
    localStorage.removeItem("carpool-token");
    setUser(null);
  };

  // ✅ REFRESH PROFILE AFTER UPDATE
  const refreshProfile = async () => {
    try {
      const token = localStorage.getItem("carpool-token");
      if (!token) return;

      const res = await api.get("/users/me");

      setUser({ ...res.data, token });
      localStorage.setItem("carpool-user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to refresh profile");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, refreshProfile, loadingUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
  