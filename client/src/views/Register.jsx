import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "../css/register.module.css"; // Importa el archivo CSS como módulo

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook para navegar entre rutas

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Nombre: nombre,
        CorreoElectronico: correo,
        usuario: usuario,
        Contraseña: contraseña,
        NivelUsuario: 2, // Nivel de usuario por defecto
      }),
    });

    const data = await response.json();
    if (response.ok) {
      Swal.fire({
        title: '¡Éxito!',
        text: 'Usuario registrado exitosamente',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirigir al login o a la página que desees
        navigate("/login");
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: data.message || "Ocurrió un error",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      setError(data.message || "Ocurrió un error");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registrarse</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.registerButton}>Registrarse</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <p className={styles.recoverPassword}>
        <Link to="/login" className={styles.recoverLink}>
          Iniciar Sesión
        </Link>
      </p>
    </div>
  );
};

export default Register;
