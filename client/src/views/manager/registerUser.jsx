import React, { useState } from "react";
import Swal from "sweetalert2"; // Importa sweetalert2

const RegisterUser = () => {
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: "",
    CorreoElectronico: "",
    usuario: "",
    Contraseña: "",
    NivelUsuario: 0,
  });

  const handleUserTypeClick = (type) => {
    setUserType(type);
    setFormData((prevData) => ({
      ...prevData,
      NivelUsuario: type === "gerente" ? 0 : 1,
    }));
  };

  const handleCerrarClick = () => {
    setUserType(null);
    setFormData({
      Nombre: "",
      CorreoElectronico: "",
      usuario: "",
      Contraseña: "",
      NivelUsuario: 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isEmailValid = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(aguilaazulindustries\.com|aguilaazulenterprises\.com)$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar el correo electrónico
    if (!isEmailValid(formData.CorreoElectronico)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El correo electrónico debe ser de @aguilaazulindustries.com o @aguilaazulenterprises.com.",
      });
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Error al registrar el usuario");
      }

      // Cambia alert por Swal
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Usuario registrado correctamente",
      });
      handleCerrarClick();
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      // Cambia alert por Swal
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Registrar Usuario</h1>
      {!userType ? (
        <div style={styles.buttonGroup}>
          <button
            onClick={() => handleUserTypeClick("gerente")}
            style={styles.button}
          >
            Gerente
          </button>
          <button
            onClick={() => handleUserTypeClick("empleado")}
            style={styles.button}
          >
            Empleados
          </button>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGrid}>
              {["Nombre", "CorreoElectronico", "usuario", "Contraseña"].map(
                (field, index) => (
                  <div key={index} style={styles.inputGroup}>
                    <label style={styles.label}>
                      {field.replace(/([A-Z])/g, " $1")}:{" "}
                    </label>
                    <input
                      type={field === "Contraseña" ? "password" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </div>
                )
              )}
            </div>
            <button type="submit" style={styles.button}>
              Registrar
            </button>
            <button
              type="button"
              onClick={handleCerrarClick}
              style={styles.closebutton}
            >
              Cerrar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// Estilos en línea
const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    margin: "20px 0", // Margen para separar el título de los botones
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between", // Coloca los botones en los extremos
    marginBottom: "20px", // Margen inferior para separar de los inputs
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff", // Azul
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    flex: 1, // Permite que los botones ocupen espacio igual
    margin: "0 5px", // Espacio entre los botones
  },
  closebutton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bdf", // Azul
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    flex: 1, // Permite que los botones ocupen espacio igual
    margin: "0 5px", // Espacio entre los botones
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  label: {
    marginBottom: "5px",
  },
};

export default RegisterUser;
