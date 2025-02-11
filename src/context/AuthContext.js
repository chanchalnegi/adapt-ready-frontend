import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "../axiosConfig";

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      await axios.get("/dishes/");
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const login = async () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await axios.post("/auth/logout");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
