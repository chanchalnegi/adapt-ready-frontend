import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "./Header";

const ProtectedRoute = ({ element: Component }) => {
  const { checkAuth, isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth(); // Ensure authentication check runs on mount
      setLoading(false);
    };
    verifyAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Prevent redirect loop before auth check is complete
  }

  return isAuthenticated ? (
    <div>
      <Header />
      <Component />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
