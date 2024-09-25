import React, { useState } from "react";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

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
      alert("Usuario registrado exitosamente");
      // Redirigir al login o a la página que desees
    } else {
      setError(data.message || "Ocurrió un error");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registrarse</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          style={styles.input}
        />
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
        <button type="submit" style={styles.registerButton}>Registrarse</button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
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
  registerButton: {
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
};

export default Register;
