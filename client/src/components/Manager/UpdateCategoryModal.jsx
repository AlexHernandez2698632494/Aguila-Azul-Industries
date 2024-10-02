import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import styles from "../../css/CategoryDetail.module.css"; // Importamos el módulo CSS

const UpdateCategoryModal = ({ categoria, onClose, onUpdate }) => {
  const [nombre, setNombre] = useState(categoria.Nombre || "");
  const [imagen, setImagen] = useState(categoria.Imagen || "");

  const handleUpdate = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/category/${categoria.CategoriaID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: nombre,
          Imagen: imagen,
        }),
      });

      if (response.ok) {
        Swal.fire("¡Éxito!", "Categoría actualizada correctamente", "success");
        onUpdate(); // Refresca la tabla después de actualizar
      } else {
        Swal.fire("Error", "No se pudo actualizar la categoría", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al actualizar", "error");
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Actualizar Categoría</h2>
        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <label>Imagen</label>
        <input
          type="text"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />
        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.btnUpdate} onClick={handleUpdate}>
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategoryModal;
