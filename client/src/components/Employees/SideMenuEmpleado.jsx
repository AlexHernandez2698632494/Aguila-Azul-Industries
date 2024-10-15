import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate
import { useAuth } from "../../auth/AuthContext"; 
import Swal from "sweetalert2"; // Importa SweetAlert2

const SideMenuEmpleado = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate(); // Inicializa useNavigate

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = async () => {
    // Muestra un SweetAlert de confirmación
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres cerrar sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'No, cancelar'
    });

    if (result.isConfirmed) {
      logout();

      // Limpia los datos del localStorage
      localStorage.removeItem("usuario");
      localStorage.removeItem("usuarioFirebase");

      // Redirige al usuario a la página de inicio de sesión
      navigate("/login");
    }
  };

  return (
    <div className="menulateral-employee">
      <div className="header">Aguila Azul Industries</div>
      <ul className="menu-items">
        <li>
          <button onClick={() => toggleMenu("productos")}>Productos</button>
          {openMenu === "productos" && (
            <ul className="submenu">
              <li>
                <Link to="/employee/registerProduct">Registro de productos</Link>
              </li>
              <li>
                <Link to="/employee">Control de productos</Link>
              </li>
            </ul>
          )}
        </li>
        {/* Menú de Informes */}
        <li>
          <button onClick={() => toggleMenu("informes")}>Informes</button>
          {openMenu === "informes" && (
            <ul className="submenu">
              <li>
                <Link to="/employee/informes">Ver Informes</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
      <div className="separator"></div>
      <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default SideMenuEmpleado;
