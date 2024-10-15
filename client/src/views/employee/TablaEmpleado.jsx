import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import '../../css/employee.css'; 

const TablaEmpleado = ({ productos }) => {
  const [registrosMostrados, setRegistrosMostrados] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Productos recibidos:", productos); // Muestra los productos en la consola
  }, [productos]);

  const productosFiltrados = productos.filter(producto =>
    producto.Nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * registrosMostrados,
    paginaActual * registrosMostrados
  );

  return (
    <div className="employee-dashboard">
      <div className="content-employee">
        <div className="control-de-productos-employee">
          <h2>Control de productos</h2>
        </div>

        <div className="contenedor-productos-employee">
          <div className="subtitulo-employee">
            <h4>Productos registrados</h4>
          </div>

          <div className="top-controls-employee">
            <div className="show-records-employee">
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
            <div className="search-box-employee">
              <label htmlFor="buscar">Buscar:</label>
              <input
                type="text"
                id="buscar"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <table className="table-employee">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad en stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosPagina.length > 0 ? (
                productosPagina.map((producto) => (
                  <tr key={producto.ProductoID}>
                    <td>{producto.Nombre}</td>
                    <td>{producto.Precio}</td>
                    <td>
                      {producto.CantidadDisponible !== undefined && producto.CantidadDisponible !== null
                        ? producto.CantidadDisponible
                        : "No disponible"}
                    </td>
                    <td>
                      <button
                        className="btn-employee btn-view-employee"
                        onClick={() => navigate(`/employee/product/${producto.ProductoID}`)}
                      >
                        <FaEye className="icon" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay productos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination-employee">
            {Array.from({ length: Math.ceil(productosFiltrados.length / registrosMostrados) }, (_, index) => (
              <button
                key={index}
                className={paginaActual === index + 1 ? "active" : ""}
                onClick={() => setPaginaActual(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaEmpleado;
