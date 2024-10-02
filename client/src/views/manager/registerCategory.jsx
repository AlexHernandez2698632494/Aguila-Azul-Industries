import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from '../../css/registerCategoria.module.css'; // Importar como módulo

const RegisterCategory = () => {
  const [nombre, setNombre] = useState('');
  const [imagen, setImagen] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que ambos campos estén llenos
    if (!nombre || !imagen) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa ambos campos antes de continuar.',
        confirmButtonText: 'OK'
      });
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    try {
      const response = await fetch(`${API_URL}/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nombre: nombre,
          Imagen: imagen
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la categoría');
      }

      // Mostrar mensaje de éxito usando SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Categoría registrada',
        text: 'La categoría se registró con éxito.',
        confirmButtonText: 'OK'
      });

      // Limpiar el formulario
      setNombre('');
      setImagen('');
    } catch (error) {
      // Mostrar mensaje de error usando SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ocurrió un error al registrar la categoría',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Registrar Categoría</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Nombre de la Categoría:</label>
          <input
            type="text"
            className={styles.formInput}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>URL de la Imagen:</label>
          <input
            type="text"
            className={styles.formInput}
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.formSubmit}>Registrar Categoría</button>
      </form>
    </div>
  );
};

export default RegisterCategory;
