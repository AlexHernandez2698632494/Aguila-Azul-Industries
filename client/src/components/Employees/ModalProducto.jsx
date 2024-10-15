import React, { useState, useEffect } from "react";

const ModalProductoEmpleado = ({ show, onClose, onSave, producto, categorias, proveedores }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      setMensaje({ texto: "Guardado con éxito", tipo: "exito" });
    } catch (error) {
      setMensaje({ texto: "Error al guardar", tipo: "error" });
    }
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Actualizar Producto</h2>
        {mensaje.texto && <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" name="Nombre" value={formData.Nombre} onChange={handleInputChange} />

          <label>Descripción:</label>
          <textarea name="Descripcion" value={formData.Descripcion} onChange={handleInputChange}></textarea>

          <label>Precio:</label>
          <input type="number" name="Precio" value={formData.Precio} onChange={handleInputChange} />

          <label>Imagen:</label>
          <input type="text" name="Imagen" value={formData.Imagen} onChange={handleInputChange} />

          <label>Categoría:</label>
          <select name="CategoriaID" value={formData.CategoriaID} onChange={handleInputChange}>
            {categorias.map((categoria) => (
              <option key={categoria.CategoriaID} value={categoria.CategoriaID}>
                {categoria.Nombre}
              </option>
            ))}
          </select>

          <label>Proveedor:</label>
          <select name="ProveedorID" value={formData.ProveedorID} onChange={handleInputChange}>
            {proveedores.map((proveedor) => (
              <option key={proveedor.ProveedorID} value={proveedor.ProveedorID}>
                {proveedor.Nombre}
              </option>
            ))}
          </select>

          <button type="submit">Guardar</button>
        </form>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ModalProductoEmpleado;
