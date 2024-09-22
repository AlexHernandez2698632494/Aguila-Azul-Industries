import React, { useState } from "react";
import { FaTimes, FaUser } from "react-icons/fa";
import "../css/SideMenu.css";

const SideMenu = ({ menuOpen, setMenuOpen }) => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  if (!menuOpen) return null;

  return (
    <div className="side-menu">
      <div className="menu-header">
        <FaTimes
          onClick={() => setMenuOpen(false)}
          className="icon close-menu"
        />
        <FaUser className="icon user-icon" />
      </div>
      <ul>
        <li>
          <a href="/">Inicio</a>
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
              <li>
                <a href="#">Alimentos</a>
              </li>
              <li>
                <a href="#">Ropa</a>
              </li>
              <li>
                <a href="#">Tecnología</a>
              </li>
              <li>
                <a href="#">Químicos</a>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
