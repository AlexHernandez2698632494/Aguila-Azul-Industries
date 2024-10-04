import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/CardsSection.module.css"; // Asegúrate de usar CSS Modules correctamente

const CardsSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Para controlar si el componente está montado y evitar fugas de memoria

    const fetchCategories = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }
        const data = await response.json();
        if (isMounted) {
          setCategories(data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false; // Limpieza cuando el componente se desmonta
    };
  }, []);

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error}
        <button onClick={() => window.location.reload()}>Reintentar</button> {/* Botón para reintentar */}
      </div>
    );
  }

  return (
    <div className={styles.cards}>
      {categories.map((category) => (
        <div key={category.CategoriaID} className={styles.card}>
          <h3>{category.Nombre}</h3>
          <img src={category.Imagen} alt={category.Nombre} className={styles["card-image"]} />
          <button
            className={styles["view-products-btn"]}
            onClick={() => navigate(`/category/${category.CategoriaID}`)}
          >
            Ver productos
          </button>
        </div>
      ))}
    </div>
  );
};

export default CardsSection;
