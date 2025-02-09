import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";

const ProtectedRoute = ({ element: Component }) => {
  const { isAuthenticated } = useAuth();

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
