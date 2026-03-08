import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { token: t, ...userData } = res.data;
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(t);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === "Admin";
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, isAdmin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
