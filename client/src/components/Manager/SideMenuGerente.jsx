import React, { useState } from "react";
import { Link } from "react-router-dom"; // Asegúrate de importar Link

const SideMenu = () => {
  const [openMenu, setOpenMenu] = useState(null); // Estado para controlar qué menú está abierto

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="menulateral">
      <div className="header">Aguila Azul Industries</div>
      <ul className="menu-items">
        <li>
          <button onClick={() => toggleMenu("productos")}>Productos</button>
          {openMenu === "productos" && (
            <ul className="submenu">
              <li>
                <Link to="/productos/registro">Registro de productos</Link>{" "}
                {/* Uso de Link aquí */}
              </li>
              <li>
                <Link to="/manager">Control de productos</Link>
              </li>
              <li>
                <Link to="/productos/eliminados">Productos Eliminados</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Menú de Categorias con submenú */}
        <li>
          <button onClick={() => toggleMenu("categorias")}>Categorias</button>
          {openMenu === "categorias" && (
            <ul className="submenu">
              <li>
                <Link to="/categorias/registro">Registro de categorias</Link>
              </li>
              <li>
                <Link to="/categorias/control">Control de categorias</Link>
              </li>
              <li>
                <Link to="/categorias/eliminados">Categorias Eliminados</Link>
              </li>
            </ul>
          )}
        </li>
        {/* Menú de Usuarios con submenú */}
        <li>
          <button onClick={() => toggleMenu("usuarios")}>Usuarios</button>
          {openMenu === "usuarios" && (
            <ul className="submenu">
              <li>
                <Link to="/usuarios/registrar">Registrar Usuario</Link>
              </li>
              <li>
                <Link to="/usuarios/control">Control de Usuarios</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Menú de Informes con submenú */}
        <li>
          <button onClick={() => toggleMenu("informes")}>Informes</button>
          {openMenu === "informes" && (
            <ul className="submenu">
              <li>
                <Link to="/informes/control">Control de Informes</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
      <div className="separator"></div>
      <button className="logout-btn">Cerrar sesión</button>
    </div>
  );
};

export default SideMenu;