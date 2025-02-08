import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import "../styles/DishTable.css";

const DishTable = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const itemsPerPage = 10;

  const ingredientOptions = [
    { label: "Rice flour", value: "rice flour" },
    { label: "Coconut", value: "coconut" },
    { label: "Jaggery", value: "jaggery" },
    { label: "Banana", value: "banana" },
    { label: "Ghee", value: "ghee" },
    // Add more ingredients as needed
  ];

  useEffect(() => {
    fetchDishes();
  }, [currentPage, searchTerm, sortConfig, selectedIngredients]);

  const fetchDishes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/dishes", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          sort_by: sortConfig.key,
          order: sortConfig.direction,
          ingredients: selectedIngredients.map((ing) => ing.value).join(","),
        },
      });
      setDishes(response.data);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to fetch dishes");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="table-container">
      <div className="controls">
        <MultiSelect
          options={ingredientOptions}
          value={selectedIngredients}
          onChange={setSelectedIngredients}
          labelledBy="Select Ingredients"
          hasSelectAll={false}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>Dish Name</th>
              <th onClick={() => handleSort("prep_time")}>Preparation Time</th>
              <th onClick={() => handleSort("cook_time")}>Cooking Time</th>
              <th onClick={() => handleSort("ingredients")}>Ingredients</th>
              <th onClick={() => handleSort("diet")}>Diet</th>
              <th onClick={() => handleSort("flavor_profile")}>Flavor</th>
              <th onClick={() => handleSort("state")}>State</th>
              <th onClick={() => handleSort("region")}>Region</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {dishes && dishes.results && dishes.results.length > 0 ? (
              dishes.results.map((dish) => (
                <tr key={dish.id}>
                  <td>{dish.name}</td>
                  <td>{dish.prep_time}</td>
                  <td>{dish.cook_time}</td>
                  <td>{dish.ingredients}</td>
                  <td>{dish.diet}</td>
                  <td>{dish.flavor_profile}</td>
                  <td>{dish.state}</td>
                  <td>{dish.region}</td>
                  <td>
                    <Link to={`/dishes/${dish.id}`}>
                      <FaEye />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <div className="pagination-controls">
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DishTable;
