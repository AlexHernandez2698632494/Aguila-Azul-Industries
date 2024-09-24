import React, { useState, useEffect } from "react";
import { FaTimes, FaUser } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import "../css/SideMenu.css";

const SideMenu = ({ menuOpen, setMenuOpen }) => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

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
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false); // Cierra el menú al hacer clic en un enlace
  };

  if (!menuOpen) return null;

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="side-menu">
      <div className="menu-header">
        <FaTimes onClick={() => setMenuOpen(false)} className="icon close-menu white-icon" />
        <FaUser className="icon user-icon white-icon" />
      </div>
      <ul className="menu">
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={handleLinkClick}>
            Inicio
          </Link>
        </li>
        <li>
          <span
            className="categories-title"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
          >
            Categorías
          </span>
          {categoriesOpen && (
            <ul className="submenu">
              {categories.map((category) => (
                <li key={category.CategoriaID}>
                  <Link
                    to={`/category/${category.CategoriaID}`}
                    className={location.pathname === `/category/${category.CategoriaID}` ? "active" : ""}
                    onClick={handleLinkClick} // Cierra el menú al hacer clic en la categoría
                  >
                    {category.Nombre}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
