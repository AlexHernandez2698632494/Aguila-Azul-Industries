import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      return;
    }

    const nivelUsuario = data.NivelUsuario; 
    if (nivelUsuario === 0) {
      navigate("/manager");
    } else if (nivelUsuario === 1) {
      navigate("/employee");
    } else if (nivelUsuario === 2) {
      navigate("/client");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Iniciar Sesión</h2>
      <p style={styles.optionText}>
        <button style={styles.optionButton} onClick={() => {/* Lógica para iniciar sesión con otra opción */}}>
          Google
        </button>
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.loginButton}>Ingresar</button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
      <button 
        style={styles.registerButton} 
        onClick={() => navigate('/register')}
      >
        Registrarse
      </button>
      <p style={styles.recoverPassword}>
        <Link to="/recover" style={styles.recoverLink}>Recuperar contraseña</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: '20px',
    color: '#002F6C',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border 0.3s',
  },
  loginButton: {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#002F6C',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
  },
  optionText: {
    margin: '10px 0',
  },
  optionButton: {
    border: '1px solid #7EB9FF',
    backgroundColor: 'white',
    color: '#7EB9FF',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  registerButton: {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#7EB9FF',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  recoverPassword: {
    marginTop: '10px',
  },
  recoverLink: {
    color: '#002F6C',
    textDecoration: 'none',
  },
};

export default Login;
