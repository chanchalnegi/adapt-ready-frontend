import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { Link } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";
import "../styles/DishTable.css";
import Select from "react-select";

const DishList = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteDishId, setDeleteDishId] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState(null);

  const [ingredientOptions, setIngredientOptions] = useState([
    { label: "Rice flour", value: "rice flour" },
    { label: "Coconut", value: "coconut" },
    { label: "Jaggery", value: "jaggery" },
    { label: "Banana", value: "banana" },
    { label: "Ghee", value: "ghee" },
  ]);

  const dietOptions = [
    { label: "Vegetarian", value: "vegetarian" },
    { label: "Non-Vegetarian", value: "non-vegetarian" },
    { label: "Vegan", value: "vegan" },
  ];

  const flavorOptions = [
    { label: "Sweet", value: "sweet" },
    { label: "Spicy", value: "spicy" },
    { label: "Savory", value: "savory" },
  ];

  const itemsPerPage = 10;

  useEffect(() => {
    fetchDishes();
  }, [
    currentPage,
    sortConfig,
    selectedIngredients,
    selectedDiet,
    selectedFlavor,
  ]);

  const fetchDishes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/dishes", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          sort_by: sortConfig.key,
          order: sortConfig.direction,
          ingredients: selectedIngredients.map((ing) => ing.value).join(","),
          diet: selectedDiet ? selectedDiet.value : "",
          flavor: selectedFlavor ? selectedFlavor.value : "",
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

  const handleAddIngredient = (inputValue) => {
    if (!inputValue.trim()) return;

    const newIngredient = {
      label: inputValue.trim(),
      value: inputValue.trim().toLowerCase(),
    };

    // Prevent duplicates
    if (
      !ingredientOptions.find((option) => option.value === newIngredient.value)
    ) {
      setIngredientOptions((prev) => [...prev, newIngredient]);
    }

    // Select the newly added ingredient
    setSelectedIngredients((prev) => [...prev, newIngredient]);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setCurrentPage(1); // Reset page to 1 when sorting changes
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

  const openDeletePopup = (id) => {
    setDeleteDishId(id);
    setShowDeletePopup(true);
  };

  const handleDelete = async () => {
    if (!deleteDishId) return;

    try {
      await axios.delete(`/dishes/${deleteDishId}`);

      // Ensure dishes.results exists before filtering
      setDishes((prevDishes) => ({
        ...prevDishes,
        results: prevDishes.results
          ? prevDishes.results.filter((dish) => dish.id !== deleteDishId)
          : [],
      }));
    } catch (error) {
      alert("Failed to delete dish.");
    } finally {
      setShowDeletePopup(false);
      setDeleteDishId(null);
    }
  };

  return (
    <div className="table-container">
      <div className="controls">
        <Select
          options={ingredientOptions}
          value={selectedIngredients}
          onChange={setSelectedIngredients}
          isMulti
          isSearchable
          placeholder="Select or add ingredients..."
          noOptionsMessage={({ inputValue }) =>
            inputValue
              ? `Press Enter to add "${inputValue}"`
              : "No options available"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value) {
              handleAddIngredient(e.target.value);
              e.preventDefault();
            }
          }}
          menuPortalTarget={document.body} // Ensures dropdown renders outside parent constraints
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensures it stays on top
            menu: (provided) => ({
              ...provided,
              minWidth: "250px",
              maxHeight: ingredientOptions.length > 5 ? "200px" : "auto",
              overflowY: ingredientOptions.length > 5 ? "auto" : "hidden",
            }),
            menuList: (provided) => ({
              ...provided,
              maxHeight: ingredientOptions.length > 5 ? "150px" : "auto",
              overflowY: ingredientOptions.length > 5 ? "auto" : "hidden",
            }),
            control: (provided) => ({
              ...provided,
              minWidth: "250px",
              whiteSpace: "normal",
              overflow: "visible",
            }),
            multiValue: (provided) => ({
              ...provided,
              maxWidth: "100%",
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              whiteSpace: "normal",
            }),
          }}
        />
        <Select
          options={dietOptions}
          value={selectedDiet}
          onChange={setSelectedDiet}
          isClearable
          placeholder="Filter by diet"
          menuPortalTarget={document.body} // Ensures dropdown renders outside parent constraints
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensures it stays on top
            menu: (provided) => ({
              ...provided,
              minWidth: "250px",
              maxHeight: ingredientOptions.length > 5 ? "200px" : "auto",
              overflowY: ingredientOptions.length > 5 ? "auto" : "hidden",
            }),
            menuList: (provided) => ({
              ...provided,
              maxHeight: ingredientOptions.length > 5 ? "150px" : "auto",
              overflowY: ingredientOptions.length > 5 ? "auto" : "hidden",
            }),
            control: (provided) => ({
              ...provided,
              minWidth: "250px",
              whiteSpace: "normal",
              overflow: "visible",
            }),
            multiValue: (provided) => ({
              ...provided,
              maxWidth: "100%",
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              whiteSpace: "normal",
            }),
          }}
        />
        <Select
          options={flavorOptions}
          value={selectedFlavor}
          onChange={setSelectedFlavor}
          isClearable
          placeholder="Filter by flavor"
          menuPortalTarget={document.body} // Ensures dropdown renders outside parent constraints
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensures it stays on top
            menu: (provided) => ({
              ...provided,
              minWidth: "250px",
              maxHeight: ingredientOptions.length > 5 ? "200px" : "auto",
              overflowY: ingredientOptions.length > 5 ? "auto" : "hidden",
            }),
            menuList: (provided) => ({
              ...provided,
              maxHeight: ingredientOptions.length > 5 ? "150px" : "auto",
              overflowY: ingredientOptions.length > 5 ? "auto" : "hidden",
            }),
            control: (provided) => ({
              ...provided,
              minWidth: "250px",
              whiteSpace: "normal",
              overflow: "visible",
            }),
          }}
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
              <th>Ingredients</th>
              <th>Diet</th>
              <th>Flavor</th>
              <th>State</th>
              <th>Region</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dishes?.results?.length > 0 ? (
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
                    <FaTrash
                      onClick={() => openDeletePopup(dish.id)}
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        color: "red",
                      }}
                    />
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

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="delete-popup">
          <div className="delete-popup-content">
            <p>Are you sure you want to delete this dish?</p>
            <div className="delete-button-class">
              <button onClick={handleDelete} className="delete-confirm">
                Yes
              </button>
              <button
                onClick={() => setShowDeletePopup(false)}
                className="delete-cancel"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishList;
