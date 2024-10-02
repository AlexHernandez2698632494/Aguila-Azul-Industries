import React, { useState, useEffect } from "react";
import { FaTrashRestore } from "react-icons/fa";
import ConfirmationModal from "../../components/Manager/ConfirmationModal"; // Asegúrate de importar el modal de confirmación
import Swal from "sweetalert2"; // Asegúrate de instalar sweetalert2
import '../../css/deleteProductManager.module.css';

const DeleteProductManager = () => {
  const [registrosMostrados, setRegistrosMostrados] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [productoAEliminar, setProductoAEliminar] = useState(null); // Producto a restaurar
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para el modal de confirmación

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await fetch(`${API_URL}/productsI`); // Cambia la ruta según tus necesidades
    const data = await response.json();
    setProductos(data);
  };

  const handleRestaurarProducto = (producto) => {
    setProductoAEliminar(producto);
    setShowConfirmation(true);
  };

  const confirmRestaurar = async () => {
    if (!productoAEliminar) return; // Asegurarse de que hay un producto seleccionado
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/productRestore/${productoAEliminar.ProductoID}`, {
        method: "DELETE", // Asegúrate de usar DELETE ya que es el endpoint para restaurar
      });

      if (!response.ok) {
        throw new Error("Error al restaurar el producto");
      }

      await fetchProductos(); // Refrescar la lista de productos
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Producto restaurado exitosamente.',
      });
    } catch (error) {
      console.error("Error al restaurar el producto:", error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al restaurar el producto.',
      });
    } finally {
      setShowConfirmation(false);
    }
  };

  const totalPaginas = Math.ceil(productos.length / registrosMostrados);
  const productosPagina = productos.slice(
    (paginaActual - 1) * registrosMostrados,
    paginaActual * registrosMostrados
  );

  return (
    <div className="delete-product-manager">
      <h2>Restauración de productos</h2>
      <div className="subtitulo">
        <h4>Productos eliminados</h4>
      </div>
      <hr className="linea-separadora" />
      <div className="top-controls">
        <div className="show-records">
          <label htmlFor="registros">Mostrar</label>
          <select
            id="registros"
            value={registrosMostrados}
            onChange={(e) => setRegistrosMostrados(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>registros</span>
        </div>
        <div className="search-box">
          <label htmlFor="buscar">Buscar:</label>
          <input
            type="text"
            id="buscar"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosPagina.length > 0 ? (
            productosPagina.map((producto) => (
              <tr key={producto.ProductoID}>
                <td>{producto.Nombre}</td>
                <td>
                  <button
                    className="btn btn-restore"
                    onClick={() => handleRestaurarProducto(producto)}
                  >
                    <FaTrashRestore className="icon" /> Restaurar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No hay productos eliminados disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Paginación */}
      <div className="pagination">
        {Array.from({ length: totalPaginas }, (_, index) => (
          <button
            key={index}
            className={paginaActual === index + 1 ? "active" : ""}
            onClick={() => setPaginaActual(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal de confirmación */}
      {showConfirmation && (
        <ConfirmationModal
          productName={productoAEliminar?.Nombre}
          onConfirm={confirmRestaurar}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default DeleteProductManager;
