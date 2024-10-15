import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, signInWithPopup } from "../firebase";
import Swal from "sweetalert2";
import styles from "../css/login.module.css";
import { useAuth } from "../auth/AuthContext"; // Importa el contexto de autenticación

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Usa el hook del contexto

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Guardar usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify({ 
        usuario: user.email, 
        email: user.email 
      }));

      // Llama a la función login para actualizar el estado de autenticación
      login();

      console.log("Usuario autenticado con Google:", user);
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Has iniciado sesión con Google",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/client");
      });
    } catch (error) {
      console.error("Error en autenticación con Google:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al iniciar sesión con Google",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: usuario,
        Contraseña: contraseña,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "Ocurrió un error");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "Ocurrió un error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Guardar usuario en localStorage
    localStorage.setItem("usuario", JSON.stringify({ 
      usuario: usuario, 
      nivel: data.NivelUsuario 
    }));

    // Llama a la función login para actualizar el estado de autenticación
    login();

    const nivelUsuario = data.NivelUsuario;
    let redirectPath = "";
    if (nivelUsuario === 0) {
      redirectPath = "/manager";
    } else if (nivelUsuario === 1) {
      redirectPath = "/employee";
    } else if (nivelUsuario === 2) {
      redirectPath = "/client";
    }

    Swal.fire({
      icon: "success",
      title: "Inicio de sesión exitoso",
      text: "Bienvenido",
      confirmButtonText: "OK",
    }).then(() => {
      navigate(redirectPath);
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      <p className={styles.optionText}>
        <button className={styles.optionButton} onClick={handleGoogleLogin}>
          Google
        </button>
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
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
        <button type="submit" className={styles.loginButton}>Ingresar</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <p className={styles.recoverPassword}>
        <Link to="/register" className={styles.recoverLink}>
          Registrarse
        </Link>
      </p>
      <p className={styles.recoverPassword}>
        <Link to="/recover" className={styles.recoverLink}>
          Recuperar contraseña
        </Link>
      </p>
    </div>
  );
};

export default Login;
