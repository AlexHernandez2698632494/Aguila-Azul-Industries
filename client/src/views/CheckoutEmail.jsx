import React, { useState } from "react";
import { FaShoppingCart, FaCreditCard, FaTruck } from "react-icons/fa";
import { auth, googleProvider, signInWithPopup } from "../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2
import styles from "../css/CheckoutEmail.module.css";

const CheckoutEmail = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    usuario: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre login y registro

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Verificar si el usuario existe en localStorage
    const usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal && usuarioLocal !== "undefined" && usuarioLocal !== "null") {
      // Código 1: Inicia sesión y navega
      const shippingData = localStorage.getItem("shippingData");
      navigate(shippingData ? "/checkout/payment" : "/checkout/shipping");
      return;
    }
  
    // Si no está en localStorage, buscar en la base de datos
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/username/${formData.usuario}`);
      
      if (response.status === 200) {
        // Usuario encontrado en la base de datos
        const data = await response.json();
        
        // Verificar el nivel de usuario
        if (data.NivelUsuario === 0) {
          Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: "No tienes acceso, eres Gerente.",
          });
          return; // Detener el flujo
        } else if (data.NivelUsuario === 1) {
          Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: "No tienes acceso, eres Empleado.",
          });
          return; // Detener el flujo
        } else {
          // Usuario permitido, guardar en localStorage
          localStorage.setItem("usuario", JSON.stringify(data));
  
          // Código 1: Inicia sesión y navega
          const shippingData = localStorage.getItem("shippingData");
          navigate(shippingData ? "/checkout/payment" : "/checkout/shipping");
        }
      } else if (response.status === 404) {
        // Usuario no encontrado
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Usuario no existe",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al buscar el usuario",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al conectar con el servidor",
      });
    }
  };   
  
  const handleRegister = async (e) => {
    e.preventDefault();
  
    const usuarioData = {
      Nombre: formData.nombre,
      CorreoElectronico: formData.correo,
      usuario: formData.usuario,
      Contraseña: formData.password,
      NivelUsuario: 2, // Nivel de usuario fijo en 2
      UsuarioIDGoogle: 0 // Usuario normal, no de Google
    };
  
    // Guardar en localStorage
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioData),
      });
  
      const data = await response.json();
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "Usuario registrado correctamente",
        });
        const shippingData = localStorage.getItem("shippingData");
        navigate(shippingData ? "/checkout/payment" : "/checkout/shipping");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Hubo un problema con el registro",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al conectar con el servidor",
      });
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
    
      const googleUserData = {
        Nombre: user.displayName,
        CorreoElectronico: user.email,
        usuario: user.email,
        Contraseña: null,
        NivelUsuario: 2,
        UsuarioIDGoogle: 1
      };
      
      // Verificar si el usuario ya existe en la base de datos
      const checkResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/username/${googleUserData.usuario}`);
      if (checkResponse.status === 200) {
        // El usuario ya está registrado, iniciar sesión
        localStorage.setItem("usuarioFirebase", JSON.stringify(googleUserData));
        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: "Has iniciado sesión con Google",
        }).then(() => {
          const shippingData = localStorage.getItem("shippingData");
          navigate(shippingData ? "/checkout/payment" : "/checkout/shipping");
        });
      } else if (checkResponse.status === 404) {
        // El usuario no existe, registrarlo
        const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(googleUserData),
        });
  
        const data = await response.json();
        if (response.status === 201) {
          localStorage.setItem("usuarioFirebase", JSON.stringify(googleUserData));
          Swal.fire({
            icon: "success",
            title: "Inicio de sesión exitoso",
            text: "Has iniciado sesión con Google",
          }).then(() => {
            const shippingData = localStorage.getItem("shippingData");
            navigate(shippingData ? "/checkout/payment" : "/checkout/shipping");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Hubo un problema al registrar con Google",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al verificar el usuario",
        });
      }
    } catch (error) {
      console.error("Error en autenticación con Google:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al iniciar sesión con Google",
      });
    }
  };
     
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleCartClick = () => {
    navigate("/checkout/cart");
  };

  const handleCredicCartClick = () => {
    navigate("/checkout/email");
  };

  const handlePaymentClick = () => {
    navigate("/checkout/payment");
  };

  return (
    <div className={styles.pageContainer}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img
            src="https://github.com/AlexHernandez2698632494/pictures/blob/main/Aguila_Azul_Industries%20(2).png?raw=true"
            alt="Logo"
          />
        </div>
        <div className={styles.icons}>
          <div
            className={`${styles.iconWithText} ${styles.darkBlueIcon}`}
            onClick={handleCartClick}
          >
            <FaShoppingCart className={`${styles.icon} ${styles.darkBlue}`} />
            <span className={styles.darkBlue}>Carrito de Compras</span>
          </div>
          <div className={`${styles.iconSeparator}`} />
          <div
            className={`${styles.iconWithText} ${styles.cardIcon}`}
            onClick={handleCredicCartClick}
          >
            <FaCreditCard className={`${styles.icon} ${styles.whiteIcon}`} />
            <span className={styles.whiteText}>Tarjeta</span>
          </div>
          <div className={`${styles.iconSeparator}`} />
          <div
            className={`${styles.iconWithText} ${styles.darkBlueIcon}`}
            onClick={handlePaymentClick}
          >
            <FaTruck className={`${styles.icon} ${styles.darkBlue}`} />
            <span className={styles.darkBlue}>Entrega</span>
          </div>
        </div>
      </nav>

      <div className={styles.container}>
        <div className={styles.summaryColumn}>
          {isLogin ? (
            <>
              <h2 className={styles.title}>Iniciar Sesión</h2>
              <button className={styles.googleButton} onClick={handleGoogleLogin}>
                Google
              </button>
              <form className={styles.loginForm} onSubmit={handleLogin}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    id="usuario"
                    name="usuario"
                    placeholder="Usuario"
                    required
                    value={formData.usuario}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Contraseña"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit" className={styles.continueButton}>
                  Ingresar
                </button>
              </form>
              <div className={styles.links}>
                <a href="#!" className={styles.link} onClick={toggleForm}>
                  Registrarse
                </a>
                <a href="/recover-password" className={styles.link}>
                  Recuperar contraseña
                </a>
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.title}>Registro de Usuario</h2>
              <form className={styles.loginForm} onSubmit={handleRegister}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Nombre"
                    required
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    placeholder="Correo Electrónico"
                    required
                    value={formData.correo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    id="usuario"
                    name="usuario"
                    placeholder="Usuario"
                    required
                    value={formData.usuario}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Contraseña"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit" className={styles.continueButton}>
                  Registrarse
                </button>
              </form>
              <div className={styles.links}>
                <a href="#!" className={styles.link} onClick={toggleForm}>
                  Iniciar Sesión
                </a>
              </div>
            </>
          )}
        </div>
      </div>
      <footer className={styles.footer}>
        <p>&copy; 2024 Tu Tienda. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default CheckoutEmail;
