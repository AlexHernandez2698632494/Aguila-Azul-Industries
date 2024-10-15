import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../css/PurchaseHistoryDetailsClient.module.css";

const OrderDetails = () => {
  const { ventaId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${API_URL}/ventas/${ventaId}`);
        if (!response.ok) {
          throw new Error("Error al obtener los detalles del pedido");
        }

        const data = await response.json();
        setOrderDetails(data.venta);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [ventaId]);

  if (loading) return <p>Cargando detalles del pedido...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!orderDetails) return <p>No se encontraron detalles del pedido</p>;

  const { 
    productos = [], 
    Subtotal, 
    Descuento, 
    Total, 
    DireccionEnvio, 
    FechaVenta, 
    FechaEnvio, 
    QuienRecibe, 
    EstadoEnvio 
  } = orderDetails;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Detalles del pedido #{orderDetails.VentaID}</h2>
      <div className={styles.detailsContainer}>
        <h3 className={styles.subtitle}>Productos</h3>
        {productos.length > 0 ? (
          productos.map((producto, index) => (
            <div key={index} className={styles.productItem}>
              <img
                src={producto.ProductoImagen || "https://via.placeholder.com/100"}
                alt={producto.ProductoNombre}
                className={styles.productImage}
              />
              <div>
                <p><strong>Nombre:</strong> {producto.ProductoNombre}</p>
                <p><strong>Precio:</strong> 
                  {typeof producto.PrecioProducto === "string" ? `$${parseFloat(producto.PrecioProducto).toFixed(2)}` : "N/A"}
                </p>
                <p><strong>Cantidad:</strong> {producto.Cantidad}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos en este pedido.</p>
        )}

        <h3 className={styles.subtitle}>Resumen del Pedido</h3>
        <p><strong>Subtotal:</strong> ${parseFloat(Subtotal).toFixed(2)}</p>
        <p><strong>Descuento:</strong> -${parseFloat(Descuento).toFixed(2)}</p>
        <p><strong>Total:</strong> ${parseFloat(Total).toFixed(2)}</p>

        <h3 className={styles.subtitle}>Detalles de Envío</h3>
        <p><strong>Dirección de Envío:</strong> {DireccionEnvio}</p>
        <p><strong>Fecha de Venta:</strong> {new Date(FechaVenta).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
        <p><strong>Fecha de Entrega:</strong> {new Date(FechaEnvio).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
        <p><strong>Recibe:</strong> {QuienRecibe}</p>
        <p><strong>Estado del Envío:</strong> {EstadoEnvio}</p>
      </div>

      <button 
        onClick={() => navigate('/purchasehistory')} 
        className={styles.backButton}
      >
        ← Regresar a Historial de Compras
      </button>
    </div>
  );
};

export default OrderDetails;
