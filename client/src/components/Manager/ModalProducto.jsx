import React, { useState, useEffect } from "react";
import styles from "../../css/ModalProducto.module.css"; // Importar estilos

const ModalProducto = ({ show, onClose, onSave, producto, categorias, proveedores }) => {
  const [formData, setFormData] = useState({
    Nombre: "",
    Descripcion: "",
    Precio: 0,
    Imagen: "",
    CategoriaID: "",
    ProveedorID: "",
    Especificaciones: [],
  });

  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  useEffect(() => {
    if (producto) {
      setFormData({
        Nombre: producto.Nombre,
        Descripcion: producto.Descripcion,
        Precio: producto.Precio,
        Imagen: producto.Imagen,
        CategoriaID: producto.CategoriaID,
        ProveedorID: producto.ProveedorID,
        Especificaciones: producto.Especificaciones || [],
      });
    }
  }, [producto]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEspecificacionChange = (index, field, value) => {
    const updatedEspecificaciones = [...formData.Especificaciones];
    updatedEspecificaciones[index][field] = value;
    setFormData({
      ...formData,
      Especificaciones: updatedEspecificaciones,
    });
  };

  const handleAddEspecificacion = () => {
    setFormData({
      ...formData,
      Especificaciones: [...formData.Especificaciones, { NombreEspecificacion: "", ValorEspecificacion: "" }],
    });
  };

  const handleRemoveEspecificacion = (index) => {
    const updatedEspecificaciones = formData.Especificaciones.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      Especificaciones: updatedEspecificaciones,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        CategoriaID: formData.CategoriaID === "" ? producto.CategoriaID : formData.CategoriaID,
        ProveedorID: formData.ProveedorID === "" ? producto.ProveedorID : formData.ProveedorID,
      };
      await onSave(updatedData);
      setMensaje({ texto: "Guardado con éxito", tipo: "exito" });
    } catch (error) {
      setMensaje({ texto: "Error al guardar", tipo: "error" });
    }
  };

  if (!show) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Actualizar Producto</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.column}>
              <label>Nombre:</label>
              <input
                type="text"
                name="Nombre"
                value={formData.Nombre}
                onChange={handleInputChange}
                className={styles.inputField}
              />
            </div>
            <div className={styles.column}>
              <label>Descripción:</label>
              <textarea
                name="Descripcion"
                value={formData.Descripcion}
                onChange={handleInputChange}
                className={styles.inputField}
              ></textarea>
            </div>
            <div className={styles.column}>
              <label>Precio:</label>
              <input
                type="number"
                name="Precio"
                value={formData.Precio}
                onChange={handleInputChange}
                className={styles.inputField}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <label>Imagen:</label>
              <input
                type="text"
                name="Imagen"
                value={formData.Imagen}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.column}>
              <label>Categoría:</label>
              <label>{categorias.find(c => c.CategoriaID === formData.CategoriaID)?.Nombre || "No asignada"}</label>
              <select
                name="CategoriaID"
                value={formData.CategoriaID}
                onChange={handleInputChange}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.CategoriaID} value={categoria.CategoriaID}>
                    {categoria.Nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.column}>
              <label>Proveedor:</label>
              <label>{proveedores.find(p => p.ProveedorID === formData.ProveedorID)?.Nombre || "No asignado"}</label>
              <select
                name="ProveedorID"
                value={formData.ProveedorID}
                onChange={handleInputChange}
              >
                <option value="">Selecciona un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.ProveedorID} value={proveedor.ProveedorID}>
                    {proveedor.Nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.row}>
            <label>Especificaciones:</label>
          </div>
          {formData.Especificaciones.map((spec, index) => (
            <div key={index} className={styles.especificacion}>
              <div className={styles.specInputContainer}>
                <input
                  type="text"
                  placeholder="Nombre de la Especificación"
                  value={spec.NombreEspecificacion}
                  onChange={(e) =>
                    handleEspecificacionChange(index, "NombreEspecificacion", e.target.value)
                  }
                />
              </div>
              <div className={styles.specInputContainer}>
                <input
                  type="text"
                  placeholder="Valor de la Especificación"
                  value={spec.ValorEspecificacion}
                  onChange={(e) =>
                    handleEspecificacionChange(index, "ValorEspecificacion", e.target.value)
                  }
                />
              </div>
              <button
                type="button"
                className={styles.botonEliminar}
                onClick={() => handleRemoveEspecificacion(index)}
              >
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" className={styles.botonAgregar} onClick={handleAddEspecificacion}>
            Agregar
          </button>
          <div className={styles.footer}>
            <button type="submit" className={styles.botonGuardar}>Guardar</button>
            <button type="button" className={styles.botonCerrar} onClick={onClose}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalProducto;
