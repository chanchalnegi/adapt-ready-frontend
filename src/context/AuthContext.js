import React, { createContext, useState, useContext, useEffect } from "react";

// Create the AuthContext
export const AuthContext = createContext(null);

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  // Load authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // Login function (Save token to localStorage)
  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  // Logout function (Remove token from localStorage)
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  // Check localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
