import React, { useState, useEffect } from "react";
import { FaEye, FaSync, FaTrash, FaSortUp, FaSortDown } from "react-icons/fa";
import ModalProducto from "../../components/Manager/ModalProducto";
import ConfirmationModal from "../../components/Manager/ConfirmationModal"; // Asegúrate de importar el modal de confirmación
import { useNavigate } from 'react-router-dom';

const TablaGerente = () => {
  const [registrosMostrados, setRegistrosMostrados] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [columnaOrden, setColumnaOrden] = useState(null);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [productos, setProductos] = useState([]);
  const [productosOrdenados, setProductosOrdenados] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para el modal de confirmación
  const [productoAEliminar, setProductoAEliminar] = useState(null); // Producto a eliminar
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [mensaje, setMensaje] = useState(""); // Estado para el mensaje de éxito o error
  const [mensajeVisible, setMensajeVisible] = useState(false); // Estado para mostrar el mensaje
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchProveedores();
  }, []);

  const fetchProductos = async () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    setProductos(data);
  };

  const fetchCategorias = async () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    setCategorias(data);
  };

  const fetchProveedores = async () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await fetch(`${API_URL}/suppliers`);
    const data = await response.json();
    setProveedores(data);
  };

  useEffect(() => {
    let productosFiltrados = productos.filter((producto) =>
      producto.Nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (columnaOrden) {
      productosFiltrados.sort((a, b) => {
        const valorA = a[columnaOrden];
        const valorB = b[columnaOrden];

        if (typeof valorA === "string" && typeof valorB === "string") {
          return ordenAscendente
            ? valorA.localeCompare(valorB)
            : valorB.localeCompare(valorA);
        } else if (typeof valorA === "number" && typeof valorB === "number") {
          return ordenAscendente ? valorA - valorB : valorB - valorA;
        }
        return 0;
      });
    }

    setProductosOrdenados(productosFiltrados);
  }, [productos, busqueda, columnaOrden, ordenAscendente]);

  const handleVerProducto = (id) => {
    navigate(`/manager/product/${id}`); // Navega a la vista de detalles del producto
  };

  const handleActualizarProducto = async (id) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/product/${id}`);

      if (!response.ok) {
        throw new Error("Error al obtener el producto");
      }

      const producto = await response.json();
      setProductoSeleccionado(producto);
      setShowModal(true);
    } catch (error) {
      console.error("Error al obtener el producto:", error.message);
      alert("Ocurrió un error al obtener el producto. Verifica la consola para más detalles.");
    }
  };

  const handleModalSave = async (formData) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(
        `${API_URL}/product/${productoSeleccionado.ProductoID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Nombre: formData.Nombre,
            Descripcion: formData.Descripcion,
            Precio: parseFloat(formData.Precio),
            Imagen: formData.Imagen,
            CategoriaID: parseInt(formData.CategoriaID),
            ProveedorID: parseInt(formData.ProveedorID),
            Especificaciones: formData.Especificaciones,
            NombreCategoria: formData.NombreCategoria
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar el producto: ${errorText}`);
      }

      await fetchProductos(); // Refrescar la lista de productos
      setShowModal(false);
    } catch (error) {
      console.error("Error al actualizar el producto:", error.message);
      alert("Ocurrió un error al actualizar el producto. Verifica la consola para más detalles.");
    }
  };

  const handleDeleteProduct = (producto) => {
    setProductoAEliminar(producto);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!productoAEliminar) return; // Asegurarse de que hay un producto seleccionado
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/product/${productoAEliminar.ProductoID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      await fetchProductos(); // Refrescar la lista de productos
      setShowConfirmation(false);
      setMensaje("Producto eliminado exitosamente."); // Mensaje de éxito
      setMensajeVisible(true); // Mostrar el mensaje
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
      setMensaje("Ocurrió un error al eliminar el producto."); // Mensaje de error
      setMensajeVisible(true); // Mostrar el mensaje
    } finally {
      setTimeout(() => {
        setMensajeVisible(false); // Ocultar el mensaje después de 3 segundos
      }, 3000);
    }
  };

  const totalPaginas = Math.ceil(productosOrdenados.length / registrosMostrados);
  const productosPagina = productosOrdenados.slice(
    (paginaActual - 1) * registrosMostrados,
    paginaActual * registrosMostrados
  );

  return (
    <div>
      <div className="control-de-productos">
        <h2>Control de productos</h2>
      </div>

      <div className="contenedor-productos">
        <div className="subtitulo">
          <h4>Productos registrados</h4>
        </div>

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
              <th onClick={() => setColumnaOrden("Nombre")}>
                Nombre{" "}
                {columnaOrden === "Nombre" && (ordenAscendente ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th onClick={() => setColumnaOrden("Precio")}>
                Precio{" "}
                {columnaOrden === "Precio" && (ordenAscendente ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th onClick={() => setColumnaOrden("Categoria.Nombre")}>
                Categoría{" "}
                {columnaOrden === "Categoria.Nombre" && (ordenAscendente ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th onClick={() => setColumnaOrden("Proveedor.Nombre")}>
                Proveedor{" "}
                {columnaOrden === "Proveedor.Nombre" && (ordenAscendente ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPagina.length > 0 ? (
              productosPagina.map((producto) => (
                <tr key={producto.ProductoID}>
                  <td>{producto.Nombre}</td>
                  <td>{producto.Precio}</td>
                  <td>{producto.Categoria?.Nombre}</td>
                  <td>{producto.Proveedor?.Nombre}</td>
                  <td>
                    <button
                      className="btn btn-view"
                      onClick={() => handleVerProducto(producto.ProductoID)}
                    >
                      <FaEye className="icon" />
                    </button>
                    <button
                      className="btn btn-update"
                      onClick={() => handleActualizarProducto(producto.ProductoID)}
                    >
                      <FaSync className="icon" />
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteProduct(producto)}
                    >
                      <FaTrash className="icon" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay productos disponibles</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mensaje de éxito o error */}
        {mensajeVisible && (
          <div className="notification">
            {mensaje}
          </div>
        )}

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
            onConfirm={confirmDelete}
            onCancel={() => setShowConfirmation(false)}
          />
        )}

        {/* Modal para actualizar producto */}
        <ModalProducto
          producto={productoSeleccionado}
          categorias={categorias}
          proveedores={proveedores}
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleModalSave}
        />
      </div>
    </div>
  );
};

export default TablaGerente;
