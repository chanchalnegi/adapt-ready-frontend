import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaSignOutAlt, FaHome } from "react-icons/fa";
import axios from "../axiosConfig";
import "../styles/Header.css";

const Header = ({ onSearch = () => {} }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.length > 1) {
      fetchSuggestions(searchTerm);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get("/dishes/search", {
        params: { query },
      });

      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  const handleSuggestionClick = (dishId) => {
    setSearchTerm("");
    setSuggestions([]);
    navigate(`/dishes/${dishId}`);
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">Dish Explorer</h1>
      </div>
      <div className="header-center">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {suggestions.length > 0 ? (
            <ul className="suggestions-list">
              {suggestions.map((dish) => (
                <li
                  key={dish.id}
                  onClick={() => handleSuggestionClick(dish.id)}
                >
                  {dish.name}
                </li>
              ))}
            </ul>
          ) : searchTerm.length > 1 ? (
            <div className="no-suggestions">No suggestions found</div>
          ) : null}
        </div>
      </div>
      <div className="header-right">
        <Link to="/dashboard" className="nav-link">
          <FaHome /> Home
        </Link>
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
