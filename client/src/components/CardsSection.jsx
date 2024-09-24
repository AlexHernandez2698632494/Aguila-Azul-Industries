import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CardsSection.css";

const CardsSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="cards">
      {categories.map((category) => (
        <div key={category.CategoriaID} className="card">
          <h3>{category.Nombre}</h3>
          <img src={category.Imagen} alt={category.Nombre} className="card-image" />
          <button
            className="view-products-btn"
            onClick={() => navigate(`/category/${category.CategoriaID}`)} // Redirige a la nueva ruta
          >
            Ver productos
          </button>
        </div>
      ))}
    </div>
  );
};

export default CardsSection;
