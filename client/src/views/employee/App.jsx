import React, { useEffect, useState } from "react";
import TablaEmpleado from "./TablaEmpleado"; // Importar la tabla del empleado
import "../../css/manager.css"; // Usamos el CSS de gerente

const EmployeeIndex = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      const data = await response.json();
      console.log("Datos obtenidos:", data); // Verifica la respuesta
      setProductos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="manager-content"> {/* Usamos la misma clase que el gerente */}
      <TablaEmpleado productos={productos} />
    </div>
  );
};

export default EmployeeIndex;
