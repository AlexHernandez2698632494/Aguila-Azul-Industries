import React, { useEffect, useState } from "react";
import styles from "../../css/userDetail.module.css"; // Asegúrate de que la ruta del CSS sea correcta

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);
  const [busqueda, setBusqueda] = useState("");
  const [columnaOrden, setColumnaOrden] = useState(null);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [usuariosOrdenados, setUsuariosOrdenados] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsuarios(data);
    };
    fetchUsuarios();
  }, []);

  useEffect(() => {
    let usuariosFiltrados = usuarios.filter((usuario) =>
      usuario.Nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (columnaOrden) {
      usuariosFiltrados.sort((a, b) => {
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

    setUsuariosOrdenados(usuariosFiltrados);
  }, [usuarios, busqueda, columnaOrden, ordenAscendente]);

  const totalPaginas = Math.ceil(usuariosOrdenados.length / registrosPorPagina);
  const usuariosPagina = usuariosOrdenados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  return (
    <div className={styles.mainContainer}>
      <div className={styles.controlContainer}>
        <h1 className={styles.titulo}>Control de Usuario</h1>
      </div>

      <div className={styles.restoDelCodigo}>
        <h2 className={styles.subtitulo}>Usuarios Registrados</h2>
        <hr className={styles.lineaSeparacion} />

        <div className={styles.filtro}>
          <div className={styles.filtroItem}>
            <label htmlFor="registros">Mostrar:</label>
            <select
              id="registros"
              value={registrosPorPagina}
              onChange={(e) => setRegistrosPorPagina(Number(e.target.value))}
              className={styles.select}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
          <div className={styles.filtroItem}>
            <label htmlFor="busqueda">Buscar:</label>
            <input
              type="text"
              id="busqueda"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className={styles.inputBusqueda}
            />
          </div>
        </div>

        <table className={styles.tabla}>
          <thead>
            <tr>
              <th onClick={() => setColumnaOrden("NivelUsuario")}>
                Tipo de Usuario{" "}
                {columnaOrden === "NivelUsuario" &&
                  (ordenAscendente ? "▲" : "▼")}
              </th>
              <th onClick={() => setColumnaOrden("usuario")}>
                Usuario{" "}
                {columnaOrden === "usuario" &&
                  (ordenAscendente ? "▲" : "▼")}
              </th>
              <th onClick={() => setColumnaOrden("Nombre")}>
                Nombre{" "}
                {columnaOrden === "Nombre" &&
                  (ordenAscendente ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {usuariosPagina.length > 0 ? (
              usuariosPagina.map((usuario) => (
                <tr key={usuario.UsuarioID}>
                  <td>{usuario.NivelUsuario === 0 ? "Gerente" : usuario.NivelUsuario === 1 ? "Empleado" : "Cliente"}</td>
                  <td>{usuario.usuario}</td>
                  <td>{usuario.Nombre}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No hay usuarios disponibles</td>
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
      </div>
    </div>
  );
};

export default Usuarios;
