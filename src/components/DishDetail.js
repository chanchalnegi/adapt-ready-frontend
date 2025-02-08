import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "../styles/DishDetail.css"; // Import the CSS file for styling

const DishDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await axios.get(`/dishes/${id}`);
        setDish(response.data);
      } catch (err) {
        setError("Failed to fetch dish details");
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!dish) return <p>No dish found.</p>;

  return (
    <div className="dish-detail-card">
      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>
      <h2 className="dish-title">{dish.name}</h2>
      <p>
        <strong>Ingredients:</strong> {dish.ingredients}
      </p>
      <p>
        <strong>Diet Type:</strong> {dish.diet}
      </p>
      <p>
        <strong>Preparation Time:</strong> {dish.prep_time} minutes
      </p>
      <p>
        <strong>Cooking Time:</strong> {dish.cook_time} minutes
      </p>
      <p>
        <strong>Flavor:</strong> {dish.flavor_profile}
      </p>
      <p>
        <strong>Course:</strong> {dish.course}
      </p>
      <p>
        <strong>State:</strong> {dish.state}
      </p>
      <p>
        <strong>Region:</strong> {dish.region}
      </p>
    </div>
  );
};

export default DishDetail;
