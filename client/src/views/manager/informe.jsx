import { useEffect, useState } from 'react';
import styles from '../../css/salesReport.module.css';

const SalesReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/salesReport`);
        if (!response.ok) {
          throw new Error('Error al obtener el reporte de ventas');
        }
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReport();
  }, []);

  if (loading) {
    return <p>Cargando reporte...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className={styles.salesReportContainer}>
      <h1>Reporte de Ventas</h1>

      <section>
        <h2>Producto Más Vendido</h2>
        <p>Producto: {reportData?.mostSoldProduct?.Nombre || 'No disponible'}</p>
        <p>Total vendidas: {reportData?.mostSoldProduct?.CantidadVendida || 'No disponible'} unidades</p>
      </section>

      <section>
        <h2>Producto Menos Vendido</h2>
        <p>Producto: {reportData?.leastSoldProduct?.Nombre || 'No disponible'}</p>
        <p>Total vendidas: {reportData?.leastSoldProduct?.CantidadVendida || 'No disponible'} unidades</p>
      </section>

      <section>
        <h2>Categoría Más Vendida</h2>
        <p>Nombre: {reportData?.mostSoldCategory?.Nombre || 'No disponible'}</p>
        <p>Total vendidas: {reportData?.mostSoldCategory?.TotalVendida || 'No disponible'} unidades</p>
      </section>

      <section>
        <h2>Categoría Menos Vendida</h2>
        <p>Nombre: {reportData?.leastSoldCategory?.Nombre || 'No disponible'}</p>
        <p>Total vendidas: {reportData?.leastSoldCategory?.TotalVendida || 'No disponible'} unidades</p>
      </section>

      <section>
        <h2>Informe de Inventario</h2>
        <table className={styles.inventoryTable}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Precio</th>
              <th>Cantidad Disponible</th>
              <th>Última Actualización</th>
            </tr>
          </thead>
          <tbody>
            {reportData?.inventoryReport?.map((item, index) => (
              <tr key={index}>
                <td>{item.Nombre}</td>
                <td>{item.Categoria}</td>
                <td>{item.Proveedor}</td>
                <td>{item.Precio}</td>
                <td>{item.CantidadDisponible}</td>
                <td>{formatDate(item.FechaUltimaActualizacion)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default SalesReport;
