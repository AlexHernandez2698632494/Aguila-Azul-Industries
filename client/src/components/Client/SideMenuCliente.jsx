import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from "../../auth/AuthContext"; 
import Swal from "sweetalert2"; // Importa SweetAlert2

const SideMenu = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
      navigate("/");
    }
  };

  return (
    <div className="menulateral" role="navigation" aria-label="Menú lateral">
      <div className="header">Aguila Azul Industries</div>
      <ul className="menu-items">
        <li>
          <Link to="/purchasehistory">Historial de compras</Link>
        </li>
        <li>
          <Link to="/profile/1">Perfil</Link>
        </li>
      </ul>
      <div className="separator"></div>
      <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default SideMenu;
