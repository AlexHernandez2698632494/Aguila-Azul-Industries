import React, { useState, useEffect } from "react";
import { FaSync, FaTrash, FaSortUp, FaSortDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "../../css/CategoryDetail.module.css"; // Importamos el módulo CSS
import UpdateCategoryModal from "../../components/Manager/UpdateCategoryModal"; // Importar el componente del modal
import Swal from "sweetalert2";

const CategoryDetail = () => {
  const [registrosMostrados, setRegistrosMostrados] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [columnaOrden, setColumnaOrden] = useState(null);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [categoriasOrdenadas, setCategoriasOrdenadas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar si el modal está abierto

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    setCategorias(data);
  };

  const actualizarCategorias = async () => {
    await fetchCategorias();
  };

  useEffect(() => {
    let categoriasFiltradas = categorias.filter((categoria) =>
      categoria.Nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (columnaOrden) {
      categoriasFiltradas.sort((a, b) => {
        const valorA = a[columnaOrden];
        const valorB = b[columnaOrden];

        if (typeof valorA === "string" && typeof valorB === "string") {
          return ordenAscendente
            ? valorA.localeCompare(valorB)
            : valorB.localeCompare(valorA);
        }
        return 0;
      });
    }

    setCategoriasOrdenadas(categoriasFiltradas);
  }, [categorias, busqueda, columnaOrden, ordenAscendente]);

  const handleActualizarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalOpen(true); // Esto abre el modal
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCategoriaSeleccionada(null);
  };

  const handleEliminarCategoria = (categoriaId, nombreCategoria) => {
    // Mostrar la alerta de confirmación con sweetalert
    Swal.fire({
      title: `¿Estás seguro que deseas eliminar la categoría "${nombreCategoria}"?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si se confirma, llamamos a la función que eliminará la categoría
        eliminarCategoria(categoriaId);
      }
    });
  };

  const eliminarCategoria = async (id) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      const response = await fetch(`${API_URL}/category/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "¡Eliminada!",
          text: result.message,
          icon: "success",
          confirmButtonText: "OK",
        });

        // Actualizar la lista de categorías después de la eliminación.
        actualizarCategorias(); 
      } else {
        throw new Error("Error al eliminar la categoría");
      }
    } catch (error) {
      // Mostrar mensaje de error
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudo eliminar la categoría.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleUpdateTable = () => {
    fetchCategorias();
    setModalOpen(false);
  };

  const totalPaginas = Math.ceil(
    categoriasOrdenadas.length / registrosMostrados
  );
  const categoriasPagina = categoriasOrdenadas.slice(
    (paginaActual - 1) * registrosMostrados,
    paginaActual * registrosMostrados
  );

  return (
    <div>
      <div className={styles.controlDeCategorias}>
        <h2>Control de categorías</h2>
      </div>

      <div className={styles.contenedorCategorias}>
        <div className={styles.subtitulo}>
          <h4>Categorías registradas</h4>
        </div>

        <div className={styles.topControls}>
          <div className={styles.showRecords}>
            <label htmlFor="registros">Mostrar</label>
            <select
              id="registros"
              value={registrosMostrados}
              onChange={(e) => setRegistrosMostrados(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>registros</span>
          </div>
          <div className={styles.searchBox}>
            <label htmlFor="buscar">Buscar:</label>
            <input
              type="text"
              id="buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => setColumnaOrden("Nombre")}>
                Nombre{" "}
                {columnaOrden === "Nombre" &&
                  (ordenAscendente ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasPagina.length > 0 ? (
              categoriasPagina.map((categoria) => (
                <tr key={categoria.CategoriaID}>
                  <td>{categoria.Nombre}</td>
                  <td>
                    <img
                      src={categoria.Imagen}
                      alt={categoria.Nombre}
                      width="50"
                    />
                  </td>
                  <td>
                    <button
                      className={`${styles.btn} ${styles.btnUpdate}`}
                      onClick={() => handleActualizarCategoria(categoria)}
                    >
                      <FaSync className={styles.icon} />
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnDelete}`}
                      onClick={() =>
                        handleEliminarCategoria(
                          categoria.CategoriaID,
                          categoria.Nombre
                        )
                      }
                    >
                      <FaTrash className={styles.icon} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No hay categorías disponibles</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.pagination}>
          {Array.from({ length: totalPaginas }, (_, index) => (
            <button
              key={index}
              className={paginaActual === index + 1 ? styles.active : ""}
              onClick={() => setPaginaActual(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {modalOpen && (
          <UpdateCategoryModal
            categoria={categoriaSeleccionada}
            onClose={handleCloseModal}
            onUpdate={handleUpdateTable}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
