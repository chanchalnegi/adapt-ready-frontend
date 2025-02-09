// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DishDetail from "./components/DishDetail";
import DishList from "./components/DishList";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={DishList} />}
          />
          <Route
            path="/dishes/:id"
            element={<ProtectedRoute element={DishDetail} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
