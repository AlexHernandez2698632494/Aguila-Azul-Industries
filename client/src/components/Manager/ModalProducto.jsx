import React, { useState, useEffect } from "react";

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
  
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" }); // Estado para el mensaje

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
      await onSave(formData); // Aquí enviamos los datos al servidor
      setMensaje({ texto: "Guardado con éxito", tipo: "exito" }); // Mensaje de éxito
    } catch (error) {
      setMensaje({ texto: "Error al guardar", tipo: "error" }); // Mensaje de error
    }
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Actualizar Producto</h2>
        {mensaje.texto && (
          <div className={`mensaje ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            name="Nombre"
            value={formData.Nombre}
            onChange={handleInputChange}
          />

          <label>Descripción:</label>
          <textarea
            name="Descripcion"
            value={formData.Descripcion}
            onChange={handleInputChange}
          ></textarea>

          <label>Precio:</label>
          <input
            type="number"
            name="Precio"
            value={formData.Precio}
            onChange={handleInputChange}
          />

          <label>Imagen:</label>
          <input
            type="text"
            name="Imagen"
            value={formData.Imagen}
            onChange={handleInputChange}
          />

          <label>Categoría:</label>
          <select
            name="CategoriaID"
            value={formData.CategoriaID}
            onChange={handleInputChange}
          >
            {categorias.map((categoria) => (
              <option key={categoria.CategoriaID} value={categoria.CategoriaID}>
                {categoria.Nombre}
              </option>
            ))}
          </select>

          <label>Proveedor:</label>
          <select
            name="ProveedorID"
            value={formData.ProveedorID}
            onChange={handleInputChange}
          >
            {proveedores.map((proveedor) => (
              <option key={proveedor.ProveedorID} value={proveedor.ProveedorID}>
                {proveedor.Nombre}
              </option>
            ))}
          </select>

          <label>Especificaciones:</label>
          {formData.Especificaciones.map((spec, index) => (
            <div key={index} className="especificacion">
              <input
                type="text"
                placeholder="Nombre de la Especificación"
                value={spec.NombreEspecificacion}
                onChange={(e) =>
                  handleEspecificacionChange(index, "NombreEspecificacion", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Valor de la Especificación"
                value={spec.ValorEspecificacion}
                onChange={(e) =>
                  handleEspecificacionChange(index, "ValorEspecificacion", e.target.value)
                }
              />
              <button type="button" onClick={() => handleRemoveEspecificacion(index)}>
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddEspecificacion}>
            Añadir Especificación
          </button>

          <button type="submit">Guardar</button>
        </form>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ModalProducto;

